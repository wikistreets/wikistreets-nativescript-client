<!-- @component A feed, i.e. a list of posts. -->

<script lang="ts">
  import {
    CoreTypes,
    Observable,
    ItemEventData,
    ScrollView,
  } from '@nativescript/core'
  import { Template } from 'svelte-native/components'
  import { navigate, showModal, closeModal } from 'svelte-native'
  import { NativeElementNode, NativeViewElementNode } from 'svelte-native/dom'
  import { PullToRefresh } from '@nativescript-community/ui-pulltorefresh'
  import { FeatureService } from '../services/FeatureService'
  import { user, isAuthenticated } from '~/stores/auth'

  // import other pages or components
  import PostListItem from './PostListItem.svelte'
  import PostDetails from '../pages/PostDetails.svelte'

  let pullRefresh: NativeViewElementNode<PullToRefresh>
  async function refresh() {
    if (pullRefresh) {
      pullRefresh.nativeView.refreshing = true
    }
    // do something to refesh page await refreshWeather();
    console.log(`refreshing feed...`)
    if (pullRefresh) {
      pullRefresh.nativeView.refreshing = false
    }
  }

  let posts = FeatureService.getInstance().getFeatures()
  let selectListItemTemplate = (item: any, index: number, items: any[]) => {
    // different list item keys for even and odd rows
    return index % 2 === 0 ? 'even' : 'odd'
  }

  export let onGripTap: () => void // when user taps the grip at the top of the feed

  let feedbackMessage: string
  $: feedbackMessage = $isAuthenticated
    ? `${$user?.handle}'s feed`
    : `Please don't pet the animals.  Click on them.`

  const listItemTap = (e: ItemEventData) => {
    /**
     * Handle tap events on list items
     * @param {object} e - the event arguments
     */
    const post = posts[e.index]
    console.log(`listItemTap: ${post?.id} -> ${post?.properties.title}`)
    feedbackMessage = `Last viewed: ${post?.properties.title}`
    navigate({
      page: PostDetails,
      props: { postId: post.id },
      clearHistory: false,
    })
  }
</script>

<stackLayout orientation="vertical" {...$$restProps}>
  <label
    class="py-4 text-center text-md bg-slate-600 rounded-t-lg"
    text={feedbackMessage}
    on:tap={onGripTap}
  />
  <pullrefresh bind:this={pullRefresh} on:refresh={refresh}>
    <listView
      class="list-group"
      separatorColor="transparent"
      items={posts}
      itemTemplateSelector={selectListItemTemplate}
      on:itemTap={listItemTap}
    >
      <Template key="odd" let:item>
        <PostListItem
          {item}
          class="bg-gray-100 dark:bg-gray-800 border-b-gray-400 border-b-2"
        />
      </Template>
      <Template key="even" let:item>
        <PostListItem
          {item}
          class="dark:bg-gray-900 border-b-gray-400 border-b-2"
        />
      </Template>
    </listView>
  </pullrefresh>
</stackLayout>
