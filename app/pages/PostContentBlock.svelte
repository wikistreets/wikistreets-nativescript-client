<script lang="ts">
import { Image, TextField } from '@nativescript/core'
import { TNSPlayer } from '@nativescript-community/audio';
import { NativeViewElementNode } from 'svelte-native/dom'
import { icons } from '~/utils/icons';
  import { onDestroy, onMount } from 'svelte'
export let item
export let type: string
let audioPlayer: TNSPlayer
let playIcon: string = icons['play-circle']
let pauseIcon: string = icons['pause-circle']
let isPlaying: boolean = false

onMount(() => {
    // console.log(`PostContentBlock: onMount`)
    audioPlayer = new TNSPlayer()
})

onDestroy(() => {
    // console.log(`PostContentBlock: onDestroy`)
    audioPlayer.dispose()
})

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

<gridLayout {...$$restProps} columns='40, *' rows='250, 0'>
    <stackLayout row={0} col={0} orientation='vertical' class='bg-slate-300'>
        <textView text={'.\n.\n.'} class='text-center' editable={false} />
    </stackLayout>
    <stackLayout row={0} col={1} orientation='vertical' class='m-4' horizontalAlignment='center'>
        <image bind:src={item.image.src} class='w-full h-3/4' />
        <textField bind:text={item.text} hint='Caption' autocorrect={true} returnKeyType='done' editable={true} class='w-full h-1/4 dark:text-slate-700' />
    </stackLayout>
</gridLayout>

{:else if type == 'audio'}

<gridLayout {...$$restProps} columns='40, *' rows='80, 0'>
    <stackLayout row={0} col={0} orientation='vertical' class='bg-slate-300'>
        <textView text={'.\n.\n.'} class='text-center' editable={false} />
    </stackLayout>
    <gridLayout row={0} col={1} columns='auto, *' rows='80, 0' class='m-4 w-full h-full' verticalAlignment='middle' >
        <textView visibility={isPlaying ? 'hidden' : 'visible'} row={0} col={0} bind:text={playIcon} on:tap={ onPlayAudioButtonTap } editable={false} class="icon text-4xl mx-4 my-0" />
        <textView visibility={isPlaying ? 'visible' : 'hidden'} row={0} col={0} bind:text={pauseIcon} on:tap={ onPlayAudioButtonTap } editable={false} class="icon text-4xl mx-4 my-0" />
        <textView row={0} col={1} bind:text={item.text} hint='Audio caption' editable={true} class='w-full my-2 dark:text-slate-700' />
    </gridLayout>
</gridLayout>

{:else if type == 'text'}

<gridLayout {...$$restProps} columns='40, *' rows='200,0'>
    <stackLayout row={0} col={0} orientation='vertical' class='bg-slate-300 shadow-lg'>
        <textView text={'.\n.\n.'} class='text-center' editable={false} />
    </stackLayout>    
    <textView row={0} col={1} bind:text={item.text} hint='Text' autocorrect={true} returnKeyType='done' editable={true} class="m-4 dark:text-slate-700"  />
</gridLayout>

{:else if type == 'blank-slate'}

<gridLayout {...$$restProps} columns='40, *' rows='80, 0'>
    <stackLayout row={0} col={0} orientation='vertical' class='bg-slate-300 dark:text-slate-700'>
        <textView text={'.\n.\n.'} class='text-center' editable={false} />
    </stackLayout>    
    <label row={0} col={1} text="{item.text}" class="m-4 dark:text-slate-800" />
</gridLayout>

{:else}

        <!-- nothing -->

{/if }
