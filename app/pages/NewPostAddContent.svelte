<!-- @component Register form for new users. -->

<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { navigate, closeModal, goBack } from 'svelte-native'
import { Template } from 'svelte-native/components'
import { Dialogs, EventData, Frame, Image, ImageAsset, Page, TextField, TextView, Utils, View } from '@nativescript/core'
import * as camera from "@nativescript/camera";
import { CollectionView } from '@nativescript-community/ui-collectionview'
import { Feature } from '@turf/turf'
import { user, token } from '~/stores/auth'
import { icons } from '~/utils/icons'
import { config } from '~/config/config'
import { cameraService } from '~/services/cameraService'
import { AudioRecorder } from '~/services/audioService'
import PostContentBlock from '~/components/PostContentBlock.svelte';

interface ContentBlock {
    type: 'blank-slate' | 'image' | 'audio' | 'video' | 'text'
    text?: string,
    image?: Image,
    audio?: string,
    video?: string
}

let unsubscribers: any[] = [] // will store any svelte stores we subscribe to
let items: ContentBlock[]
let controlsFeedback = 'Add photos, text, or record audio.'

let page: Page

export let streetAddress: string
export let mapCenterPoint: Feature
export let mapZoom: number

onMount(() => {
    console.log(`NewPost: onMount`)

    items = [
        // { type: 'instructions', text: 'Add photos, video, or record audio.'},
        // { type: 'blank-slate', text: 'Hello world'},
        // { type: 'image', image: sampleImage},
        // { type: 'text', text: 'Twas brillig and the slithy toves...'},
        // { type: 'audio', audio: '~/assets/audio/sample.mp3'},
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

const onItemTap = ( ({ item, index }) => {
    const collection = page.getViewById('contentCollection') as CollectionView
    collection.startDragging(index)
})

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
    // refresh so iOS doesn't mess up the heights
    refreshCollection()	
}

const onItemDragHandleTap = (e: CustomEvent) => {
    const item = e.detail.detail.item // item data is nested within two details for some reason in svelte-native
    const c = page.getViewById('contentCollection') as CollectionView
    const index = items.indexOf(item)
    c.startDragging(index)
}

const onGoBack = async () => {
    console.log(`NewPost: onGoBack: ${items.length > 0}`)
    const confirmed = (items.length > 0) ? await Dialogs.confirm({
            title: "Discard changes?",
            message: "Are you sure you want to discard your changes?",
            okButtonText: "Yes",
            cancelButtonText: "No"
    }) : await Promise.resolve(true)        
    if (confirmed) goBack()
}

const onSubmit = async () => {
    console.log(`NewPost: onSubmit`)
}

const onPhotoButtonTap =  async () => {
    if (!camera.isAvailable()) {
        Dialogs.alert({
            title: "Camera not available",
            message: "Camera is not available on this device",
            okButtonText: "OK"
        })
        return
    }
    if (!cameraService.isPermission) {
        // ask for permission, then take the photo
        cameraService.solicitPermission().then((result) => {
            if (result) {
                // permission granted
                cameraService.takePhoto().then( (image: Image) => {
                    if (image) {
                        // add new item to collection
                        const newItems: ContentBlock[] = [{ type: 'image', image: image }]
                        items = items.concat(newItems)
                        scrollToEndOfCollection()
                    }
                })
                .catch(err => {
                    console.error(`NewPost: error taking photo: ${err}`)
                })
            }
            else {
                // permission denied
                Dialogs.alert({
                    title: "Camera access denied",
                    message: "Allow camera access in device settings to add photos",
                    okButtonText: "OK"
                })

            }
        })
    }
    else {
        // just take the photo!
        cameraService.takePhoto().then( (image: Image) => {
            if (image) {
                // add new item to collection
                const newItems: ContentBlock[] = [{ type: 'image', image: image }]
                items = items.concat(newItems)
                scrollToEndOfCollection()
            }
        })
    }
}

const onMicrophoneButtonTap = () => {
    console.log(`NewPost: onMicrophoneButtonTap`)
    const newItems: ContentBlock[] = [{ type: 'audio', audio: '~/assets/audio/sample.mp3' }]
    items = items.concat(newItems)
    scrollToEndOfCollection()
}

const onTextButtonTap = () => {
    console.log(`NewPost: onTextButtonTap: created text`)
    const newItems: ContentBlock[] = [{ type: 'text', text: '' }]
    items = items.concat(newItems)
    scrollToEndOfCollection()
}

const scrollToEndOfCollection = () => {
    setTimeout(() => {
        const contentCollection = page.getViewById('contentCollection') as CollectionView
        contentCollection.scrollToIndex(contentCollection.items.length - 1, true) // animated
    }, 200)
}

/**
 * Refresh the collection...
 */
const refreshCollection = () => {
    const contentCollection = page.getViewById('contentCollection') as CollectionView
    contentCollection.refreshVisibleItems()
}

const clearClutter = () => {
    // dismiss the keyboard
    Utils.dismissKeyboard()
    Utils.dismissSoftInput()
}
</script>
        
    <page {...$$restProps} actionBarHidden={false} on:loaded={onPageLoad} on:tap={clearClutter}>
        <actionBar title="Add Content" flat="true">
            {#if __ANDROID__}
            <navigationButton
                android.systemIcon="ic_menu_back"
                text="Back"
                on:tap={onGoBack}
            />
            {:else }
            <navigationButton visibility='collapsed' text="Back" on:tap={onGoBack} />
            <actionItem
                ios.position="left"
                android.position="actionBar"
                android.systemIcon="ic_menu_close_clear_cancel"
                text="Back"
                on:tap={onGoBack}
            />
            {/if}
                <actionItem
            ios.position="right"
            android.position="actionBar"
            text="Save"
            on:tap={onSubmit}
        />
        </actionBar>
    
        <gridLayout rows="*, 120" class="h-full w-full m-0 p-0">
            <contentView row="0">
                <frame id="content">
                    <page actionBarHidden={true} >
                        <gridLayout rows="60, *" class='w-full h-full'>
                            <!-- Post title -->
                            <textField row={0} id='post-title' hint="Enter post title" class="text-2xl text-center p-2 m-2"  />

                            <!-- BEGIN: post content builder -->
                            <collectionView 
                                row={1}
                                id='contentCollection'
                                class='pt-2 pb-60'
                                separatorColor="transparent"
                                items={items}
                                colWidth="100%"
                                automationText="collectionView"
                                reorderEnabled={true}
                                reorderLongPressEnabled={true}
                                itemTemplateSelector={itemTemplateSelector}
                                itemTap={ onItemTap }
                                on:itemReorderStarting={onItemReorderStarting}
                                on:itemReorderStarted={onItemReorderStarted}
                                on:itemReordered={onItemReordered}
                                on:swipe={e => { console.log(`Feed: swipe`) }}
                            >
                                <Template key='blank-slate' let:item>
                                    <PostContentBlock type={item.type} item={item} class="w-11/12 rounded-md rounded-r-none mx-0 my-2 bg-slate-100" borderWidth={1} borderStyle='solid' borderColor='black' />
                                </Template>
                                <Template key='text' let:item>
                                    <PostContentBlock type={item.type} item={item} textHint='Enter text' class="w-11/12 rounded-md rounded-r-none mx-0 my-2 bg-slate-100" borderWidth={1} borderStyle='solid' borderColor='black' />
                                </Template>
                                <Template key='image' let:item>
                                    <PostContentBlock type={item.type} item={item} textHint='Image caption'class="w-11/12 rounded-md rounded-r-none mx-0 my-2 bg-slate-100" borderWidth={1} borderStyle='solid' borderColor='black' />
                                </Template>
                                <Template key='audio' let:item>
                                    <PostContentBlock on:dragHandleTap={ onItemDragHandleTap } type={item.type} textHint='Audio caption' item={item} class="w-11/12 rounded-m rounded-r-none mx-0 my-2 bg-slate-100" borderWidth={1} borderStyle='solid' borderColor='black' />
                                </Template>
                            </collectionView>
                            <!-- END: post content builder -->
                        </gridLayout>
    
                    </page>
                </frame>
              </contentView>
              <contentView row="1">
                <frame id="addMediaButtons">
                    <page actionBarHidden={true}>
                        <gridLayout row={1} rows="auto, auto" class="w-full h-full p-2 pb-4 m-2 border-t-2 border-b-2 border-t-slate-200 border-b-slate-200 border-solid">
                            <label row={0} class="text-center text-sm p-0 m-0 text-slate-600 dark:text-slate-400"  text="{controlsFeedback}" />
                            <flexboxLayout row={1} flexDirection="row" justifyContent="center" class="p-0 m-0">
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
    