<!-- @component A feed, i.e. a list of posts. -->

<script lang="ts">
  import { CoreTypes, ItemEventData } from '@nativescript/core'
  import { Template } from 'svelte-native/components'
  import { navigate, showModal } from 'svelte-native'
  import { FeatureService } from '../services/FeatureService'

  // import other pages or components
  import PostListItem from './PostListItem.svelte'
  import PostDetails from '../pages/PostDetails.svelte'

  let posts = FeatureService.getInstance().getFeatures()
  let selectListItemTemplate = (item: any, index: number, items: any[]) => {
    // different list item keys for even and odd rows
    return index % 2 === 0 ? 'even' : 'odd'
  }

  let feedbackMessage: String = `Please don't pet the animals.  Click on them.`

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

<stackLayout orientation="vertical" class="mb-12">
  <label
    id="foo"
    class="py-4 text-center text-md bg-green-100"
    text={feedbackMessage}
  />
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
        classes="bg-slate-100 border-b-slate-400 border-b-2"
      />
    </Template>
    <Template key="even" let:item>
      <PostListItem {item} classes="border-b-slate-400 border-b-2" />
    </Template>
  </listView>
</stackLayout>
