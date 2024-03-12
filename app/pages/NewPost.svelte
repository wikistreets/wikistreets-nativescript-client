<!-- @component Register form for new users. -->

<script lang="ts">
import { navigate, closeModal } from 'svelte-native'
import { Dialogs, EventData, Image, ImageAsset, Page, TextField } from '@nativescript/core'
import { NativeViewElementNode } from 'svelte-native/dom';
import { requestPermissions as requestCameraPermissions, isAvailable as isCameraAvailable } from '@nativescript/camera';
import * as camera from "@nativescript/camera";
import { TNSPlayer } from '@nativescript-community/audio';
import { user, token } from '~/stores/auth'
import { config } from '~/config/config'
import Login from '~/pages/Login.svelte'
import { onMount, onDestroy } from 'svelte'
import { icons } from '~/utils/icons'
import { addressData, geo, geoIsEnabled, solicitConsent as solicitGPSConsent } from '~/stores/geo'
import { geocodeLocation } from '~/services/geocodeService';
import { Template } from 'svelte-native/components'
import PostContentBlock from './PostContentBlock.svelte';
  import { CollectionView } from '@nativescript-community/ui-collectionview'

interface ContentBlock {
    type: 'blank-slate' | 'image' | 'audio' | 'video' | 'text'
    text?: string,
    image?: Image,
    audio?: string,
    video?: string
}

const cameraOptions = {
    width: 300,
    height: 300,
    keepAspectRatio: true,
    saveToGallery: false
};

let unsubscribers: any[] = [] // will store any svelte stores we subscribe to
let items: ContentBlock[]
let streetAddress: string = `${$geo.longitude} : ${$geo.latitude}`
let controlsFeedback = 'Tap to add content'
let isCameraPermission = false // whether we already have permission to access camera
let page: Page

// for testing purposes
const sampleImage = new Image()
sampleImage.src = '~/assets/images/sample.jpg'

onMount(() => {
    console.log(`NewPost: onMount`)

    if (!geoIsEnabled) {
        solicitGPSConsent().then((result) => {
            console.log(`NewPost: solicitConsent: ${result}`)
        })
    }
    // subscribe to the geo location store and save the method to unsubscribe later
    unsubscribers.push(geo.subscribe((value) => {
        // console.log(`NewPost: geo.subscribe: ${JSON.stringify(value)}`)
    }))
    
    unsubscribers.push(addressData.subscribe( (newData: geocodeLocation) => {
        // update address reactively
        if (newData && 'sys' in newData) {
            // console.log(`update: ${JSON.stringify(newData)}`)
            streetAddress = `${newData.sys.housenumber} ${newData.sys.street}, ${newData.sys.city}, ${newData.sys.country}`
        }
    }))

    items = [
        // { type: 'instructions', text: 'Add photos, video, or record audio.'},
        // { type: 'blank-slate', text: 'Hello world'},
        { type: 'audio', audio: '~/assets/audio/sample.mp3'},
        { type: 'image', image: sampleImage},
        // { type: 'text', text: 'Twas brillig and the slithy toves...'},
    ]

}) // onMount

onDestroy(() => {
    console.log(`NewPost: onDestroy`)
    // unsubscribe from any subscribed svelte stores
    unsubscribers.forEach((unsubscribe) => { unsubscribe() })
})

const onPageLoad = (e: EventData) => {
    console.log(`NewPost: onPageLoad`)
    page = e.object as Page // store reference to page
}

/**
 * Determine which template to use for each list item
 * @param item
 * @param index
 * @param items
 */
const itemTemplateSelector = (item: any, index: number, items: any[]): string => {
    return item.type
}

  /**
   * Called when user tries to reorder a list item to determine whether its allowed
   * @param e
   */
   const onItemReorderStarting = (e) => {
    // set e.returnValue to true or false to allow or cancel the reorder
    e.returnValue = !['instructions', 'geolocation'].includes(e?.item.type) // do not allow reordering of system controls
  }

/**
 * Called when user starts reordering the list
 * @param e: CollectionViewEventData
 */
 const onItemReorderStarted = ({ object, index, item }) => {
    // console.log(`Feed: onItemReorderStarted: id->${item._id}, index->${index}`)
}

/**
 * Called when user finishes reordering the list
 * @param e: CollectionViewEventData
 */
const onItemReordered = ({ object, index, item, data }) => {
    const newIndex = data.targetIndex
    if (newIndex < 0) return // user abandonded reorder
    console.log(`NewPost: onItemReorderStarted: id->${item._id}, oldIndex->${index}, newIndex->${newIndex}`)
}

const onSubmit = async () => {
    console.log(`NewPost: onSubmit`)
}

const onGPSIconTap = (e: EventData) => {
    console.log(`NewPost: onGPSIconTap: currentLocation: ${JSON.stringify($geo)}`)
    if (!$geoIsEnabled) {
      console.log(`Map: onGPSIconTap: no location data`)
      solicitGPSConsent()
      return
    }
}

const solicitCameraPermission = async () => {
    // request camera permissions, if not yet done
    return await requestCameraPermissions().then(
        () => {
            // permission granted
            console.log(`Camera permission granted.`)
            isCameraPermission = true
            return true
        },
        () => {
            //permission denied
            console.log(`Camera permission denied.`)
            Dialogs.alert({
                title: "Camera access denied",
                message: "Allow camera access in device settings to add photos",
                okButtonText: "OK"
            })
            return false
        }
    )
}

const takePhoto = async () => {
    try {
        // take a photo
        const imageAsset: ImageAsset = await camera.takePicture(cameraOptions);
        const image = new Image()
        image.src = imageAsset;
        console.log(`NewPost: takePicture: created image: ${image.src.options.width}x${image.src.options.height}`)
        // add new item to collection
        const newItems: ContentBlock[] = [{ type: 'image', image: image }]
        items = items.concat(newItems)
        // scroll to new item
        scrollToEndOfCollection()

    } catch (err) {
        console.error(`NewPost: takePicture: ${err}`)
    }
}

const onPhotoButtonTap =  async () => {
    if (!isCameraAvailable()) {
        Dialogs.alert({
            title: "Camera not available",
            message: "Camera is not available on this device",
            okButtonText: "OK"
        })
        return
    }
    if (!isCameraPermission) {
        // ask for permission, then take the photo
        solicitCameraPermission().then((result) => {
            if (result) {
                takePhoto()
            }
        })
    }
    else {
        // just take the photo!
        takePhoto()
    }
}

const onMicrophoneButtonTap = () => {
    console.log(`NewPost: onMicrophoneButtonTap`)
}

const onTextButtonTap = () => {
    console.log(`NewPost: onTextButtonTap: created text`)
    const newItems: ContentBlock[] = [{ type: 'text', text: '' }]
    items = items.concat(newItems)
    // scroll to new item
    scrollToEndOfCollection()
}

const scrollToEndOfCollection = () => {
    setTimeout(() => {
        const contentCollection = page.getViewById('contentCollection') as CollectionView
        contentCollection.scrollToIndex(contentCollection.items.length - 1, true) // animated
    }, 200)
}
</script>
    
<page {...$$restProps} on:loaded={onPageLoad}>
    <actionBar title="New post" flat="true">
    <actionItem
        ios.position="right"
        android.position="actionBar"
        text="Save"
        on:tap={onSubmit}
    />
    </actionBar>

    <gridLayout rows="70, *, 110" class="h-full w-full m-0 p-0">
        <contentView row="0">
            <frame id="geolocation">
                <page actionBarHidden={true} class="border-b-2 border-b-slate-300 border-solid box-shadow">
                    <flexboxLayout class="w-full h-full m-4 mb-0 p-4 text-center" flexDirection="row" justifyContent="center" alignContent="center" alignItems="center">
                        <label on:tap={onGPSIconTap} text="{icons['my-location']}" class="icon text-3xl mr-4"/>
                        <label text="{streetAddress}" />
                    </flexboxLayout>
                </page>
            </frame>
        </contentView>
        <contentView row="1">
            <frame id="content">
                <page actionBarHidden={true}>
                    <collectionView 
                        id='contentCollection'
                        class='pt-2 pb-60'
                        separatorColor="transparent"
                        items={items}
                        colWidth="100%"
                        automationText="collectionView"
                        reorderEnabled={true}
                        reorderLongPressEnabled={true}
                        itemTemplateSelector={itemTemplateSelector}
                        on:itemReorderStarting={onItemReorderStarting}
                        on:itemReorderStarted={onItemReorderStarted}
                        on:itemReordered={onItemReordered}
                        on:swipe={e => { console.log(`Feed: swipe`) }}
                    >
                        <Template key='blank-slate' let:item>
                            <PostContentBlock type={item.type} item={item} class="w-4/5 rounded-md mx-0 my-2 bg-slate-100" borderWidth={1} borderStyle='solid' borderColor='black' />
                        </Template>
                        <Template key='text' let:item>
                            <PostContentBlock type={item.type} item={item} class="w-4/5 rounded-md mx-0 my-2 bg-slate-100" borderWidth={1} borderStyle='solid' borderColor='black' />
                        </Template>
                        <Template key='image' let:item>
                            <PostContentBlock type={item.type} item={item} class="w-4/5 rounded-md mx-0 my-2 bg-slate-100" borderWidth={1} borderStyle='solid' borderColor='black' />
                        </Template>
                        <Template key='audio' let:item>
                            <PostContentBlock type={item.type} item={item} class="w-4/5 rounded-md mx-0 my-2 bg-slate-100" borderWidth={1} borderStyle='solid' borderColor='black' />
                        </Template>

                    </collectionView>
                </page>
            </frame>
          </contentView>
          <contentView row="2">
            <frame id="addMediaButtons">
                <page actionBarHidden={true}>
                    <gridLayout row={0} rows="auto, auto" class="w-full h-full p-2 pb-4 m-2 border-t-2 border-b-2 border-t-slate-200 border-b-slate-200 border-solid">
                        <label row={0} class="justify-center text-center text-sm p-0 m-0" text="{controlsFeedback}" />
                        <flexboxLayout row={1} flexDirection="row" justifyContent="center" class="p-0 m-0">
                                <!-- <label text="{icons.plus}" class="icon text-3xl text-slate-600 m-4"/> -->
                                <label on:tap={onPhotoButtonTap} text="{icons.camera}" class="text-5xl icon text-center align-middle m-4" />
                                <label on:tap={onMicrophoneButtonTap} text="{icons.mic}" class="text-5xl icon text-center align-middle m-4" />
                                <label on:tap={onTextButtonTap} text="{icons['font']}" class="text-5xl icon text-center align-middle m-4" />
                        </flexboxLayout>
                    </gridLayout>
            </page>
            </frame>
          </contentView>  
    </gridLayout>


</page>
