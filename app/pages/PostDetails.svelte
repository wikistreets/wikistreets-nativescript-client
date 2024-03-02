<!-- @component Detail screen for a single post. -->

<script lang="ts">
  import { onMount } from 'svelte'
  import { closeModal, goBack } from 'svelte-native'
  import { Page, EventData, fromObject, SwipeGestureEventData } from '@nativescript/core'
  import { FeatureService } from '../services/FeatureService'

  export let onComplete: Function = () => {}
  export let postId: number
  export let editable: boolean = true

  const post = FeatureService.getInstance().getFeatureById(postId)

  onMount(() => {
    console.log(`PostDetails.svelte: onMount()`)
  })

  let closePage = (e) => {
    console.log(`PostDetails.svelte: default closePage()`)
    // by default, assume this page is being displayed normally and we can go back
    goBack()
  }

  const onShownModally = (e) => {
    // if this page is within a modal, change how we close the page
    console.log(`PostDetails.svelte: onShownModally()`)
    // const page = e.object as Page
    closePage = (e) => {
      closeModal(e)
    }
  }

  const onSwipe = (e: SwipeGestureEventData) => {
    switch (e.direction) {
      case 1: // left
        console.log('swipe left')
        break
      case 2: // right
        console.log('swipe right')
        break
      case 3: // up
        console.log('swipe up')
        break
      case 4: // down
        console.log('swipe down')
        break
      default:
        console.log(`unknown swipe direction: ${e.direction}`)
    }
  }

</script>

<page on:shownModally={onShownModally} {...$$restProps} on:swipe={onSwipe}>
  <actionBar title={post.properties.title}>
    <actionItem
      ios.position="left"
      android.position="actionBar"
      ios.systemIcon="24"
      android.systemIcon="ic_menu_close_clear_cancel"
      text="Cancel"
      on:tap={e => { onComplete('PostDetail.svelte canceling') }}
    />
    {#if editable}
      <actionItem
        ios.position="right"
        android.position="actionBar"
        text="Edit"
        on:tap={e => { onComplete('PostDetail.svelte editing') }}
      />
    {/if}
    <actionItem
      ios.position="right"
      android.position="actionBar"
      ios.systemIcon="9"
      android.systemIcon="ic_menu_share"
      text="Cancel"
      on:tap={e => { onComplete('PostDetail.svelte share tapped... not functional yet.') }}
    />
  </actionBar>
  <stackLayout height="100%" class="p-4">
    <label text={post?.properties.title} class="text-xl mb-4" />
    <label text={post?.properties.body} class="text-sm mb-4" />
    <image src="https://source.unsplash.com/random" stretch="aspectFill" />
  </stackLayout>
</page>
