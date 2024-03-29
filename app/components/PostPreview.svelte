<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte'
    import { EventData } from '@nativescript/core';
    import { SharedTransition, ModalTransition } from '@nativescript/core'
    import { Feature } from '~/models/feature'
    
    export let item: Feature

    const dispatch = createEventDispatcher(); // for emitting custom messages to parent component

    // debugging
    // $: console.log(`PostPreview: post: ${JSON.stringify(post)}`)

    onMount(() => {
        console.log(`PostPreview: onMount`)
    })
    onDestroy(() => {
        console.log(`PostPreview: onDestroy`)
    })

    const onComponentLoaded = (e: EventData) => {
        // console.log(`PostPreview: onComponentLoaded`)
    }

    const onComponentUnloaded = (e: EventData) => {
        // console.log(`PostPreview: onComponentLoaded`)
    }

    const onPostPreviewTap = (e: EventData) => {
        console.log(`PostPreview: onTap`)
        dispatch('postPreviewTap', { post: item })
    }

</script>

<flexboxLayout flexDirection="row" sharedTransitionTag="selectedPost" justifyContent="flex-start" {...$$restProps} on:tap={onPostPreviewTap} on:swipe on:loaded={onComponentLoaded}>
{#if item}
    <stackLayout class="w-1/3">
      <image class="h-full" src="https://source.unsplash.com/random?id={item._id}" stretch="aspectFill" />
    </stackLayout>
    <stackLayout style="padding: 10rem;" class="w-2/3" horizontalAlignment="left" verticalAlignment="middle">
      <label text="{item.properties.title}" class="text-left text-subheading-md w-full text-t-light-primary dark:text-t-dark-primary" />
      <label text="{item.properties.address}" class="text-left text-label-sm w-full text-t-light-secondary dark:text-t-dark-secondary" />
    </stackLayout>
{/if}
</flexboxLayout>

<style>

</style>