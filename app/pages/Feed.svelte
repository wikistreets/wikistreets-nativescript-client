<!-- @component Log in form. -->

<script lang="ts">
  import { Frame, Page, View, ItemEventData, EventData} from '@nativescript/core'
  import { onMount, onDestroy } from 'svelte'
  import { navigate, showModal, closeModal } from 'svelte-native'
  import { Template } from 'svelte-native/components'
  import { get } from 'svelte/store'
  import { GPS } from '@nativescript-community/gps'
  import { FeatureService } from '../services/FeatureService'
  import { Feature, FeatureCollection as Collection } from '@turf/turf'
  import PostPreview from '~/components/PostPreview.svelte'
  import PostDetails from '~/pages/PostDetails.svelte'
  import { icons } from '../utils/icons'
  import { NativeViewElementNode } from 'svelte-native/dom'
  import { PullToRefresh } from '@nativescript-community/ui-pulltorefresh'

  let parent: Frame | View
  let pageRef: Page // reference to the current page
  let gps: GPS

  let posts: Feature[] = [] // will hold posts fetched from API
  let collection: Collection // will hold a collection fetched from the API
  const fs = FeatureService.getInstance()

  onMount(() => {
    /**
     * Svelte hook when page is mounted
    */
    console.log(`Feed: onMount`)
    // fetch data to put into feed and map
    posts = fs.getFeatures() // mock data for now
    console.log(`posts length: ${posts.length}`)
    collection = fs.getCollection() // mock data for now
  })
  onDestroy(() => {
    console.log(`Feed: onDestroy`)
  })

  const onLoadMoreItems = (e: EventData) => {
    // infinite scroll... this method is called to load more data to the listView
    console.log(`Feed: onLoadMoreItems`)
    posts.push(...fs.getFeatures()) // load more mock data for now
    console.log(`posts length: ${posts.length}`)
  }

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

  const selectListItemTemplate = (item: any, index: number, items: any[]): string => {
    // different list item keys for even and odd rows
    return index % 2 === 0 ? 'even' : 'odd'
  }
  const spanSizeSelector = (item: any, _index: number): number => {
      return 1; // all items in list are full width
  }

  const onListItemTap = (e: ItemEventData) => {
    console.log(`Feed: onListItemTap: ${JSON.stringify(e)}`)
    // console.log(`Map.svelte: onMarkerTap ${JSON.stringify(e)}`)
    // const postId = e.detail.detail.postId // get the post id from the event... it seems to be double-wrapped in a recursive detail field
    // const post: Feature = posts.find((p) => p.id === postId)
  }

  const showPost = (post: Feature) => {
    console.log(`Map: showPost: ${post.id}`)
    navigate({
      frame: Frame.getFrameById('mainFrame'),
      page: PostDetails,
      props: { postId: post.id as number },
      clearHistory: false,
      backstackVisible: false,
      transition: {
        name: 'slideLeft', // (__ANDROID__) ? 'slideLeft' : 'flipLeft', // slide | explode | fade | flipRight | flipLeft | slideLeft | slideRight | slideTop | slideBottom
        duration: 300,
        curve: 'spring' // ease | easeIn | easeInOut | easeOut | linear | spring
      }
    })
  }


</script>
  
<page actionBarHidden={false} class="w-full h-full" {...$$restProps}>
  <actionBar title="Feed" flat="true">
    <flexboxLayout class="w-full h-full" flexDirection="row" justifyContent="space-between">
      <label
      text="{icons.settings}"
      class="icons text-2xl icon text-left w-1/3"
      />
      <label text='Feed' class="text-center text-lg w-1/3" />
      <label
      text="{icons.plus}"
      class="text-2xl icon text-right w-1/3"
      on:tap={e => { console.log('create button click')}}
      />
    </flexboxLayout>
  </actionBar>
  

  <gridLayout {...$$restProps}>
    <!-- <label
      class="py-4 text-center text-md text-white bg-slate-600 rounded-t-lg"
      text={feedbackMessage}
    /> -->
    <pullrefresh bind:this={pullRefresh} on:refresh={refresh} indicatorFillColor="#f1f5f9" indicatorColor="#000">
      <collectionView 
        separatorColor="transparent"
        items={posts}
        itemTemplateSelector={selectListItemTemplate}
        colWidth="100%"
        spanSize={spanSizeSelector}
        automationText="collectionView"
        on:itemTap={onListItemTap}
        on:loadMoreItems={onLoadMoreItems}
      >
        <Template key="odd" let:item>
          <PostPreview on:tap={ ()=> { showPost(item)} } item={item} class="w-full h-40 mb-1 bg-slate-800 dark:bg-slate-800 text-slate-200 dark:text-slate-200"  />
        </Template>
        <Template key="even" let:item>
          <PostPreview on:tap={ ()=> { showPost(item)} } item={item} class="w-full h-40 mb-1 bg-slate-700 dark:bg-slate-700 text-slate-200 dark:text-slate-200"  />
        </Template>
      </collectionView>
    </pullrefresh>
  </gridLayout>
</page>
