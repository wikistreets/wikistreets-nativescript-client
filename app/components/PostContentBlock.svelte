<script lang="ts">
import { createEventDispatcher } from 'svelte'
import { Image, TextField } from '@nativescript/core'
import { TNSPlayer } from '@nativescript-community/audio';
import { NativeViewElementNode } from 'svelte-native/dom'
import { icons } from '~/utils/icons';
import { onDestroy, onMount } from 'svelte'

export let item
export let type: string
export let textHint: string = 'Text'

// audio
let audioPlayer: TNSPlayer
let playIcon: string = icons['play-circle']
let pauseIcon: string = icons['pause-circle']
let isPlaying: boolean = false

// image
let imageMode: 'portrait' | 'landscape' = 'landscape'
if (type == 'image') {
    imageMode = (item.image.src.height > item.image.src.width) ? 'portrait' : 'landscape'
}


const dispatch = createEventDispatcher(); // for emitting custom messages to parent component

onMount(() => {
    // console.log(`PostContentBlock: onMount`)
    audioPlayer = new TNSPlayer()
})

onDestroy(() => {
    // console.log(`PostContentBlock: onDestroy`)
    audioPlayer.dispose()
})

const onDragHandleTap = () => {
    dispatch('dragHandleTap', { item })
}


/**
 * Play audio track passed in item.audio
 */
const onPlayAudioButtonTap = async () => {
    if (audioPlayer.isAudioPlaying()) {
        audioPlayer.pause()
        isPlaying = false
        return
    }
    
    isPlaying = true
    audioPlayer.playFromFile({
        audioFile: item.audio,
        loop: false,
        completeCallback: (args) => {
            isPlaying = false
            console.log(`onPlayAudioButtonTap: completeCallback: ${JSON.stringify(args)}`)
        },
        errorCallback: (err) => {
            isPlaying = false
            console.log(`onPlayAudioButtonTap: error: ${JSON.stringify(err)}`)
        }
    }).then(() => {
        // what next?
    })
}

</script>

{#if type == 'image'}

<gridLayout {...$$restProps} columns='*' rows='{imageMode == 'portrait' ? 630: 430}, 0' verticalAlignment="top">
    <!-- <stackLayout row={0} col={0} orientation='vertical' class='bg-slate-300'>
        <textView on:tap={onDragHandleTap} text='{icons.close}' class='icon text-sm text-center p-0 m-0 mt-2' editable={false} />
    </stackLayout> -->
    <gridLayout row={0} col={1} rows='{imageMode == 'portrait' ? 550: 350}, 60' class='m-4'  verticalAlignment="top">
        <image row={0} bind:src={item.image.src} />
        <textViewWithHint row={1} bind:text={item.text} hint='{textHint}' autocapitalizationType="sentences" autocorrect={true} returnKeyType='done' editable={true} lineHeight={0} class='text-lg text-center w-full dark:text-slate-700' />
    </gridLayout>
</gridLayout>

{:else if type == 'audio'}

<gridLayout {...$$restProps} columns='*' rows='80, 0'>
    <!-- <stackLayout row={0} col={0} orientation='vertical' class='bg-slate-300'>
        <textView on:tap={onDragHandleTap} text='{icons.close}' class='icon text-sm text-center p-0 m-0 mt-2' editable={false} />
    </stackLayout> -->
    <gridLayout row={0} col={1} columns='auto, *' rows='80, 0' class='m-4 w-full h-full' verticalAlignment='middle'>
        <textView visibility={isPlaying ? 'hidden' : 'visible'} row={0} col={0} bind:text={playIcon} on:tap={ onPlayAudioButtonTap } editable={false} class="icon text-4xl mx-4 my-0" />
        <textView visibility={isPlaying ? 'visible' : 'hidden'} row={0} col={0} bind:text={pauseIcon} on:tap={ onPlayAudioButtonTap } editable={false} class="icon text-4xl mx-4 my-0" />
        <textViewWithHint row={0} col={1} bind:text={item.text} hint='{textHint}' autocapitalizationType="sentences" autocorrect={true} editable={true} lineHeight={0} class='text-lg w-full my-2 dark:text-slate-700' />
    </gridLayout>
</gridLayout>

{:else if type == 'text'}

<gridLayout {...$$restProps} columns='*' rows='200,0'>
    <!-- <stackLayout row={0} col={0} orientation='vertical' class='bg-slate-300'>
        <textView on:tap={onDragHandleTap} text='{icons.blur}' class='icon text-sm text-center p-0 m-0 mt-2' editable={false} />
    </stackLayout> -->
    <textViewWithHint row={0} col={1} bind:text={item.text} hint='{textHint}' autocorrect={true} autocapitalizationType='sentences' returnKeyType='done' editable={true} lineHeight={0} class="text-lg m-4 dark:text-slate-700"  />
</gridLayout>

{:else if type == 'blank-slate'}

<gridLayout {...$$restProps} columns='*' rows='80, 0'>
    <!-- <stackLayout row={0} col={0} orientation='vertical' class='bg-slate-300'>
        <textView on:tap={onDragHandleTap} text='{icons.blur}' class='icon text-sm text-center p-0 m-0 mt-2' editable={false} />
    </stackLayout> -->
    <label row={0} col={1} bind:text="{item.text}" lineHeight={0} class="text-lg m-4 dark:text-slate-800" />
</gridLayout>

{:else}

        <!-- nothing -->

{/if }
