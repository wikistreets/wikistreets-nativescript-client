<!-- @component Detail screen for a single post. -->

<script lang="ts">
  import { onMount } from 'svelte'
  import { closeModal, goBack } from 'svelte-native'
  import { Page, EventData, fromObject } from '@nativescript/core'
  import { FeatureService } from '../services/FeatureService'

  export let postId: number
  const post = FeatureService.getInstance().getFeatureById(postId)

  onMount(() => {
    console.log(`PostDetails.svelte: onMount()`)
  })

  let closePage = (e) => {
    // by default, assume this page is being displayed normally and we can go back
    goBack()
  }

  const onShownModally = (e) => {
    // if this page is within a modal, change how we close the page
    // console.log(`PostDetails.svelte: onShownModally()`)
    // const page = e.object as Page
    closePage = (e) => {
      closeModal(e)
    }
  }

</script>

<page on:shownModally={onShownModally} {...$$restProps}>
  <actionBar title={post.properties.title}>
    <navigationButton
      text="Back"
      android.systemIcon="ic_menu_back"
      on:tap={goBack}
    />
    <actionItem
      ios.position="right"
      android.position="actionBar"
      ios.systemIcon="9"
      android.systemIcon="ic_menu_share"
      text="Cancel"
      on:tap={() => closePage('Share it... but just not now')}
    />
  </actionBar>
  <stackLayout height="100%" class="p-4">
    <label text={post?.properties.title} class="text-xl mb-4" />
    <label text={post?.properties.body} class="text-sm mb-4" />
    <image src="https://source.unsplash.com/random" stretch="aspectFill" />
  </stackLayout>
</page>
