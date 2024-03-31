<!-- @component Register form for new users. -->

<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { navigate, closeModal, goBack } from 'svelte-native'
import { Template } from 'svelte-native/components'
import { Dialogs, EventData, Frame, Image, ImageAsset, Page, SwipeDirection, SwipeGestureEventData, TextField, TextView, Utils, View } from '@nativescript/core'
import { GestureHandlerTouchEvent, GestureHandlerStateEvent, GestureStateEventData, GestureTouchEventData, HandlerType, Manager as GestureManager} from '@nativescript-community/gesturehandler'
import * as camera from "@nativescript/camera"
import { CollectionView } from '@nativescript-community/ui-collectionview'
import { Feature } from '~/models/feature'
import { user, token } from '~/stores/auth'
import { icons } from '~/utils/icons'
import { config } from '~/config/config'
import { l, lc, lt } from '~/services/localeService'
import { cameraService } from '~/services/cameraService'
import { AudioPlayer, AudioRecorder } from '~/services/audioService'
import PostContentBlock from '~/components/PostContentBlock.svelte'
import { ContentBlock } from '~/models/contentBlock'
  import NewPostSelectLocation from './NewPostSelectLocation.svelte'

let unsubscribers: any[] = [] // will store any svelte stores we subscribe to
let items: ContentBlock[]
const CONTROLS_FEEDBACK_DEFAULT = lc('NewPostAddContent.controls.feedback.default')
const CONTROLS_FEEDBACK_INSTRUCTIONS = lc('NewPostAddContent.controls.feedback.instructions')
const CONTROLS_FEEDBACK_RECORDING = lc('NewPostAddContent.controls.feedback.recording')
let controlsFeedback = CONTROLS_FEEDBACK_DEFAULT

// audio recorder
let audioRecorder: AudioRecorder

// audio player
let audioPlayer: AudioPlayer = new AudioPlayer(args=>console.log(args), true, 5) // instantiate
let isPlaying: boolean = false
let isRecording: boolean = false

let page: Page
let contentCollection: CollectionView

export let streetAddress: string
export let mapCenterPoint: Feature
export let mapZoom: number


const onAudioStop = async (e?: CustomEvent) => {
    // const item = e?.detail?.detail?.item // double-nested by svelte-native
    audioPlayer.stop()
    items.forEach(item => item.isPlaying = false) // swap play/pause icons for all
    items = [...items] // reactive update
}
const onAudioPlay = (e: CustomEvent) => {
    let item = e.detail.detail.item // double-nested by svelte-native
    console.log(`NewPost: onAudioPlay: ${item.audio}`)
    if (audioPlayer.isPlaying) {
        audioPlayer.pause()
        isPlaying = false
        items.forEach(item => item.isPlaying = false) // swap play/pause icons for all
        items = [...items] // reactive update
        return
    }

    isPlaying = true
    const i = items.indexOf(item)
    items.at(i).isPlaying = true // change icon
    console.log(`Updating item ${i}`)
    items = [...items] // reactive update

    audioPlayer.start(item.audio, false, 
        args=>{
            // on complete
            console.log(`complete: ${JSON.stringify(args)}`)
            isPlaying=false
            const i = items.indexOf(item)
            items.at(i).isPlaying = false // change icon
            items = [...items] // reactive update
        }, 
        args => {
            // on error
            console.log(`error: ${args}`)
            isPlaying = false
            const i = items.indexOf(item)
            items.at(i).isPlaying = false // change icon
            items = [...items] // reactive update
        }, 
        args => {
            // on info
            console.log(`info ${args}`)
    })
}

const onGestureTouch = (args: GestureTouchEventData) => {
    // console.log('onGestureTouch', args.data.state, args.data.view, args.data.extraData)
    const { state, extraData, view } = args.data
    console.log(`onGestureTouch: ${state}`)
    view.translateX = extraData.translationX
    view.translateY = extraData.translationY
}
const onGestureState = async (args: GestureStateEventData) => {
    //guessing at states: 0=UNDETERMINED, 1=FAILED, 2=BEGAN, 3=CANCELLED, 4=ACTIVE, 5=END
    const GESTURE_BEGAN = 2
    const GESTURE_END = 5
    // based on react native gesture handler: https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/states-events
    const { state, prevState, extraData, view } = args.data
    // console.log('onGestureState', state, prevState, view, extraData)
    console.log(`onGestureState: ${state}`)
    if (state == GESTURE_BEGAN) {
        isRecording = true
        controlsFeedback = CONTROLS_FEEDBACK_RECORDING
        await onAudioStop() // stop any playing audio just in case
        audioRecorder = new AudioRecorder((args) => {
            // permissions callback
            console.log(`NewPost: audioRecorder: permissions: ${args}`)
        }, true)
        audioRecorder.start(args => {
            // error callback
            console.log(`NewPost: audioRecorder: error: ${args}`)
        },
        args => {
            // info callback
            console.log(`NewPost: audioRecorder: info: ${args}`)
        })
    }
    else if (state == GESTURE_END) {
        audioRecorder.stop().then(filePath => {
            isRecording = false
            controlsFeedback = CONTROLS_FEEDBACK_DEFAULT // revert
            console.log(`NewPost: audioRecorder: stopped: ${filePath}`)
            const newItems: ContentBlock[] = [{ type: 'audio', audio: filePath, isPlaying: false }]
            items = items.concat(newItems)
            scrollToEndOfCollection()
        })
    }

}
const manager = GestureManager.getInstance()
let gestureHandler


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
    // stop playing if it's still going
    if (audioPlayer) audioPlayer.stop() 
    audioPlayer = null
    // stop recording if it's still going
    if (audioRecorder) audioRecorder.stop() 
    audioRecorder = null
    // unsubscribe from any subscribed svelte stores
    unsubscribers.forEach((unsubscribe) => { unsubscribe() })
}) // onDestroy

const onPageLoad = (e: EventData) => {
    console.log(`NewPost: onPageLoad`)
    page = e.object as Page // store reference to page
} // onPageLoad

const onMediaButtonsLoad = (e: EventData) => {
    // attach gesture handler to microphone icon
    const page = e.object as Page // mediabuttons page
    gestureHandler = manager.createGestureHandler(HandlerType.LONG_PRESS, 10, {
        enabled: true,
    })
    gestureHandler.on(GestureHandlerTouchEvent, onGestureTouch, this)
    gestureHandler.on(GestureHandlerStateEvent, onGestureState, this)
    // const micButton = page.getViewById('microphone-button') as View
    // gestureHandler.attachToView(micButton);
    const mediaControls = page.getViewById('media-controls') as View
    gestureHandler.attachToView(mediaControls);
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
    contentCollection.startDragging(index)
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
            title: lc("NewPostAddContent.dialogs.confirmDiscard.title"),
            message: lc("NewPostAddContent.dialogs.confirmDiscard.message"),
            okButtonText: lc("common.buttons.yes"),
            cancelButtonText: lc("common.buttons.no")
    }) : await Promise.resolve(true)        
    if (confirmed) goBack()
}

const onSubmit = async () => {
    console.log(`NewPost: onSubmit`)
}

const onPhotoButtonTap =  async () => {
    if (!camera.isAvailable()) {
        Dialogs.alert({
            title: lc("NewPostAddContent.dialogs.camera.unavailable.title"),
            message: lc("NewPostAddContent.dialogs.camera.unavailable.message"),
            okButtonText: lc("common.buttons.ok")
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
                    title: lc("NewPostAddContent.dialogs.camera.permissionDenied.title"),
                    message: lc("NewPostAddContent.dialogs.camera.permissionDenied.message"),
                    okButtonText: lc("common.buttons.ok")
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
    // const newItems: ContentBlock[] = [{ type: 'audio', audio: '~/assets/audio/sample.mp3' }]
    // items = items.concat(newItems)
    // scrollToEndOfCollection()
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
    contentCollection.refresh()
}

const clearClutter = () => {
    // dismiss the keyboard
    Utils.dismissKeyboard()
    Utils.dismissSoftInput()
}

const onActionBarSwipe = (e: SwipeGestureEventData) => {
  switch (e.direction) {
    case SwipeDirection.left: // left
      console.log('NewPost: left')
      break
    case SwipeDirection.right: // right
    //   console.log('NewPost: right')
      onGoBack() // go to previous screen
      break
    case SwipeDirection.down: // down
      console.log('NewPost: down')
      break
    case SwipeDirection.up: // up
      console.log('NewPost: up')
      break
    default:
      console.log(`NewPost: ${e.direction}`)
  }
}

</script>
        
    <page {...$$restProps} actionBarHidden={false} on:loaded={onPageLoad} on:tap={clearClutter}>
        <actionBar title="{`${streetAddress.substring(0, 25)}...`}" flat="true" on:swipe={onActionBarSwipe}>
             <!-- <actionBar title="{lc('NewPostAddContent.title')}" flat="true" on:swipe={onActionBarSwipe}> -->
            {#if __ANDROID__}
            <navigationButton
                android.systemIcon="ic_menu_back"
                text="{lc('common.buttons.back')}"
                on:tap={onGoBack}
            />
            {:else }
            <navigationButton visibility='collapsed' text="Back" on:tap={onGoBack} />
            <actionItem
                ios.position="left"
                android.position="actionBar"
                android.systemIcon="ic_menu_close_clear_cancel"
                text="{lc('common.buttons.back')}"
                on:tap={onGoBack}
            />
            {/if}
                <actionItem
            ios.position="right"
            android.position="actionBar"
            text="{lc('common.buttons.save')}"
            on:tap={onSubmit}
        />
        </actionBar>
    
        <gridLayout rows="*, 60" class="h-full w-full">
            <contentView row="0">
                <frame id="content">
                    <page actionBarHidden={true} >
                        <gridLayout rows="60, *" class='w-full h-full' style="padding: 15rem;">
                            <!-- Post title -->
                                <textField id='post-title' hint="{lc('NewPostAddContent.form.title.hint')}" class="w-full text-body-md text-left placeholder-t-light-secondary" style="padding-left: 0; padding-right: 0; padding-top: 15rem; padding-bottom: 15rem; margin-bottom: 15rem; margin-top: 0; margin-left: 0; margin-right: 0;"/>
                            
                                <!-- <flexboxLayout flexDirection="column" justifyContent="center"> -->
                                <!-- Post location --> 
                                <!-- <label id='post-location' text="{`${streetAddress.substring(0, 20)}...`}" class="text-heading-sm text-center bg-s-light-brand-light" style="padding-left: 12rem; padding-right: 15rem; padding-top: 15rem; padding-bottom: 15rem; margin-top: 0rem; margin-bottom: 0; border-radius: 10rem;"/> -->
                            <!-- </flexboxLayout> -->

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
                                    <PostContentBlock type={item.type} item={item} class="w-full text-t-light-secondary bg-s-light-primary" style="border-radius: 5rem; margin-top: 5rem; margin-bottom: 5rem; margin-left: 0; margin-right: 0;" />
                                </Template>
                                <Template key='text' let:item>
                                    <PostContentBlock type={item.type} item={item} textHint='{lc('NewPostAddContent.form.text.hint')}' class="w-full text-t-light-secondary bg-s-light-primary" style="border-radius: 5rem; margin-top: 5rem; margin-bottom: 5rem; margin-left: 0; margin-right: 0;" />
                                </Template>
                                <Template key='image' let:item>
                                    <PostContentBlock type={item.type} item={item} textHint='{lc('NewPostAddContent.form.image.hint')}' class="w-full text-t-light-secondary bg-s-light-primary" style="border-radius: 5rem; margin-top: 5rem; margin-bottom: 5rem; margin-left: 0; margin-right: 0;" />
                                </Template>
                                <Template key='audio' let:item>
                                    <PostContentBlock on:audioStop={ onAudioStop } on:audioPlay={ onAudioPlay } type={item.type} textHint='{lc('NewPostAddContent.form.audio.hint')}' item={item} class="w-full text-t-light-secondary bg-s-light-primary" style="border-radius: 5rem; margin-top: 5rem; margin-bottom: 5rem; margin-left: 0; margin-right: 0;" />
                                </Template>
                            </collectionView>
                            <!-- END: post content builder -->
                        </gridLayout>
    
                    </page>
                </frame>
              </contentView>
              <contentView row="1">
                <frame id="addMediaButtons">
                    <page actionBarHidden={true} on:loaded={onMediaButtonsLoad}>
                        <gridLayout row={1} rows="auto, auto" class="w-full h-full border-t-2 border-b-2 border-t-slate-200 border-b-slate-200 border-solid" style="padding: 2rem;">
                            <flexboxLayout id="media-controls" row={0} col={3} flexDirection="row" justifyContent="space-around" backgroundColor={isRecording ? '#FFFBEB' : ''} class="p-0 m-0" style="padding-top: 8rem; padding-bottom: 8rem; margin: 0;">
                                    <label on:tap={onPhotoButtonTap} text="{icons.image}" visibility={isRecording ? 'collapsed' : 'visible'} class="text-3xl icon text-center align-middle" />
                                    <label on:tap={onMicrophoneButtonTap} on:tap={()=> {controlsFeedback=CONTROLS_FEEDBACK_INSTRUCTIONS}} text="{icons['graphic-eq']}" id='microphone-button' class="text-3xl icon text-center align-middle" />
                                    <label on:tap={onTextButtonTap} text="{icons['font']}" visibility={isRecording ? 'collapsed' : 'visible'} class="text-2xl icon text-center align-middle" />
                            </flexboxLayout>
                            <label row={1} color={isRecording ? 'red' : ''} text="{controlsFeedback}" class="text-center text-label-sm text-t-light-secondary dark:text-t-dark-secondary" style="padding-top: 4em; padding-bottom: 4rem;"/>
                        </gridLayout>
                    </page>
                </frame>
              </contentView>  
        </gridLayout>
    
    </page>
    