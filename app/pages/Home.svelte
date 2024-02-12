<script lang="ts">
  import * as geolocation from '@nativescript/geolocation'
  import { CoreTypes, ItemEventData } from '@nativescript/core'
  import { Template } from 'svelte-native/components'
  import { navigate, showModal } from 'svelte-native'
  import { FeatureService } from '../services/FeatureService'

  // import other pages or components
  import PostDetails from './PostDetails.svelte'

  let posts = FeatureService.getInstance().getFeatures()
  let selectListItemTemplate = (item: any, index: number, items: any[]) => {
    // different list item keys for even and odd rows
    return index % 2 === 0 ? 'even' : 'odd'
  }

  geolocation.enableLocationRequest().then(() => {
    geolocation
      .getCurrentLocation({
        desiredAccuracy: CoreTypes.Accuracy.high,
        maximumAge: 5000,
        timeout: 20000,
      })
      .then(currentLocation => {
        console.log('My current latitude: ', currentLocation.latitude)
      })
  })

  let feedbackMessage: String = `Please don't pet the animals.  Click on them.`

  const listItemTap = (e: ItemEventData) => {
    /**
     * Handle tap events on list items
     * @param {object} e - the event arguments
     */
    const post = posts[e.index]
    console.log(`listItemTap: ${post?.id} -> ${post?.properties.title}`)
    feedbackMessage = post?.properties.title
    navigate({
      page: PostDetails,
      props: { postId: post.id },
    })
  }
</script>

<page>
  <stackLayout orientation="vertical" height="100%">
    <label id="foo" class="my-4 text-center text-md" text={feedbackMessage} />
    <listView
      class="list-group"
      separatorColor="transparent"
      items={posts}
      itemTemplateSelector={selectListItemTemplate}
      on:itemTap={listItemTap}
      height="100%"
    >
      <Template key="odd" let:item>
        <gridLayout
          rows="*"
          columns="auto, *"
          margin="5 10"
          padding="0"
          class="bg-white"
        >
          <label
            row="0"
            col="0"
            class="p-4 text-lg"
            text={item.properties.title}
          />
          <label
            row="0"
            col="1"
            class="p-4 text-sm"
            text={item.geometry.type}
          />
        </gridLayout>
      </Template>
      <Template key="even" let:item>
        <gridLayout
          rows="*"
          columns="auto, *"
          margin="5 10"
          padding="0"
          class="bg-slate-200"
        >
          <label
            row="0"
            col="0"
            class="p-4 text-lg"
            text={item.properties.title}
          />
          <label
            row="0"
            col="1"
            class="p-4 text-sm"
            text={item.geometry.type}
          />
        </gridLayout>
      </Template>
    </listView>
  </stackLayout>
  <!-- <webView src="https://nativescript.org/" /> -->
</page>

<style>
</style>
