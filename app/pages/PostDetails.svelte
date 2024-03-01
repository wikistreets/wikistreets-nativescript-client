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

  const onShownModally = (e) => {
    console.log(`PostDetails.svelte: onShownModally()`)
    const page = e.object as Page
    const context = fromObject({
      ...e.context,
      onClose(args: EventData) {
        // unclear what this is for.  see https://docs.nativescript.org/guide/navigation/modals
        console.log(`PostDetails.svelte: onClose()`)
        // const button = args.object as Button
        // button.closeModal({
        //   name: context.name, // 'John Doe - EDITED'
        // })
      },
    })
    page.bindingContext = context // what does this do, i don't know
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
      on:tap={() => closeModal('Login form canceled')}
    />
  </actionBar>
  <stackLayout height="100%" class="p-4">
    <label text={post?.properties.title} class="text-xl mb-4" />
    <label text={post?.properties.body} class="text-sm mb-4" />
    <image src="https://source.unsplash.com/random" stretch="aspectFill" />
  </stackLayout>
</page>
