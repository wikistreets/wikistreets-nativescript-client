<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { EventData } from '@nativescript/core';
    import { Feature } from '@turf/turf'
    export let post: Feature

    // debugging
    // $: console.log(`PostMapPreview: post: ${JSON.stringify(post)}`)

    onMount(() => {
        console.log(`PostMapPreview: onMount`)
    })
    onDestroy(() => {
        console.log(`PostMapPreview: onDestroy`)
    })

    const onComponentLoaded = (e: EventData) => {
        console.log(`PostMapPreview: onComponentLoaded`)
    }

    const onComponentUnloaded = (e: EventData) => {
        console.log(`PostMapPreview: onComponentLoaded`)
    }

</script>

<flexboxLayout flexDirection="row" justifyContent="flex-start" {...$$restProps} on:tap on:swipe on:loaded={onComponentLoaded}>
{#if post}
    <stackLayout class="w-1/3 mr-4">
      <image src="https://source.unsplash.com/random?id={post.id}" stretch="aspectFill" />
    </stackLayout>
    <stackLayout class="w-2/3" horizontalAlignment="left" verticalAlignment="middle">
      <label text="{post.properties.title}" class="text-left text-lg w-full" />
      <label text="{post.properties.address}" class="text-left text-md w-full" />
    </stackLayout>
{/if}
</flexboxLayout>

<style>

</style>