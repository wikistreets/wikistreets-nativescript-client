<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { EventData } from '@nativescript/core';
    import { Feature } from '@turf/turf'
    export let item: Feature

    // debugging
    // $: console.log(`PostPreview: post: ${JSON.stringify(post)}`)

    onMount(() => {
        // console.log(`PostPreview: onMount`)
    })
    onDestroy(() => {
        // console.log(`PostPreview: onDestroy`)
    })

    const onComponentLoaded = (e: EventData) => {
        // console.log(`PostPreview: onComponentLoaded`)
    }

    const onComponentUnloaded = (e: EventData) => {
        // console.log(`PostPreview: onComponentLoaded`)
    }

</script>

<flexboxLayout flexDirection="row" justifyContent="flex-start" {...$$restProps} on:tap on:swipe on:loaded={onComponentLoaded}>
{#if item}
    <stackLayout class="w-1/3 mr-4">
      <image class="h-full" src="https://source.unsplash.com/random?id={item.id}" stretch="aspectFill" />
    </stackLayout>
    <stackLayout class="w-2/3" horizontalAlignment="left" verticalAlignment="middle">
      <label text="{item.properties.title}" class="text-left text-lg w-full" />
      <label text="{item.properties.address}" class="text-left text-md w-full" />
    </stackLayout>
{/if}
</flexboxLayout>

<style>

</style>