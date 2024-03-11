<!-- @component Log in form. -->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { navigate, showModal, closeModal } from 'svelte-native'
  import { Template } from 'svelte-native/components'
  import { get } from 'svelte/store'
  import { Frame, Page, View, ItemEventData, EventData, SwipeGestureEventData, SwipeDirection} from '@nativescript/core'
  import { SharedTransition, ModalTransition } from '@nativescript/core'
  import { FeatureService } from '../services/FeatureService'
  import { Feature, FeatureCollection as Collection } from '@turf/turf'
  import PostPreview from '~/components/PostPreview.svelte'
  import PostDetails from '~/pages/PostDetails.svelte'
  import { icons } from '../utils/icons'
  import { NativeViewElementNode } from 'svelte-native/dom'
  import { PullToRefresh } from '@nativescript-community/ui-pulltorefresh'
  import UsersPreview from '~/components/UsersPreview.svelte'
  import { geo } from '~/stores/geo'

  let parent: Frame | View
  let pageRef: Page // reference to the current page

  let unsubscribers: any[] = [] // will store any svelte stores we subscribe to

  let posts: Feature[] = [] // will hold posts fetched from API
  let collection: Collection // will hold a collection fetched from the API
  let fs: FeatureService

  onMount(async () => {
    /**
     * Svelte hook when page is mounted
    */
    console.log(`Feed: onMount`)

    // subscribe to the geo location store and save the method to unsubscribe later
    unsubscribers.push(geo.subscribe((value) => {
      console.log(`Feed: geo.subscribe: ${JSON.stringify(value)}`)
    }))

    // fetch data to put into feed and map
    fs = new FeatureService()
    posts = await fs.getMockFeatures() // mock data for now
    collection = fs.collection // mock data for now

    // add a special first item to the content list
    // const featuredUsers = {
    //   _id: 0,
    //   type: 'featuredUsers',
    //   users: [
    //     { _id: 1, handle: 'user1', avatar: 'https://source.unsplash.com/random?id=1' },
    //     { _id: 2, handle: 'user2', avatar: 'https://source.unsplash.com/random?id=2' },
    //     { _id: 3, handle: 'user3', avatar: 'https://source.unsplash.com/random?id=3' },
    //     { _id: 4, handle: 'user4', avatar: 'https://source.unsplash.com/random?id=4' },
    //     { _id: 5, handle: 'user5', avatar: 'https://source.unsplash.com/random?id=5' },
    //   ]
    // }
    // // content = [firstItem, ...posts]
    // $: content = posts // set the content to the posts for now
    // content.unshift(featuredUsers)
    
  })
  onDestroy(() => {
    console.log(`Feed: onDestroy`)
    // unsubscribe from any subscribed svelte stores
    unsubscribers.forEach((unsubscribe) => { unsubscribe() })
  })

  /**
   * For infinite scroll, called when collectionView needs more data
   * @param e
   */
  const onLoadMoreItems = async (e: EventData) => {
    // infinite scroll... this method is called to load more data to the listView
    console.log(`Feed: onLoadMoreItems`)
    const newItems = await fs.getMockFeatures() // load more mock data
    console.log(`Feed: got ${newItems.length} more items`)
    posts = posts.concat(newItems) // [...newItems, ...posts] // add to list
  }

  const onActionBarSwipe = (e: SwipeGestureEventData) => {
    // console.log(`Feed: onActionBarSwipe`)
    switch (e.direction) {
      case SwipeDirection.left: // left
        console.log('onActionBarSwipe: left')
        break
      case SwipeDirection.right: // right
        console.log('onActionBarSwipe: right')
        break
      case SwipeDirection.down: // down
        console.log('onActionBarSwipe: down')
        break
      case SwipeDirection.up: // up
        console.log('onActionBarSwipe: up')
        break
      default:
        console.log(`onActionBarSwipe: ${e.direction}`)
    }
  }

  let pullRefresh: NativeViewElementNode<PullToRefresh>
  async function refresh() {
    if (pullRefresh) {
      pullRefresh.nativeView.refreshing = true
    }
    // do something to refesh page await refreshWeather();
    console.log(`refreshing feed...`)
    posts = await fs.getMockFeatures() // mock data for now
    if (pullRefresh) {
      pullRefresh.nativeView.refreshing = false
    }
  }

  const itemTemplateSelector = (item: any, index: number, items: any[]): string => {
    // different list item keys for even and odd rows
    
     // special types
    // if (item.type == 'featuredUsers'){ 
    //   return 'featuredUsers'
    // }
    // regular posts
    return index % 2 === 0 ? 'post-even' : 'post-odd' // regular post types
  }
  const spanSizeSelector = (item: any, _index: number): number => {
      return 1; // all items in list are full width
  }

  const onListItemTap = (e: CustomEvent) => {
    const item = e.detail.detail.post // access svelte native data passed from dispatcher
    console.log(JSON.stringify(item))
    console.log(`Feed: onListItemTap: ${item._id}`)
    navigate({
      frame: Frame.getFrameById('mainFrame'),
      page: PostDetails,
      props: { post: item },
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
  <actionBar title="Feed" flat="true" on:swipe={onActionBarSwipe}>
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
        itemTemplateSelector={itemTemplateSelector}
        colWidth="100%"
        spanSize={spanSizeSelector}
        automationText="collectionView"
        on:loadMoreItems={onLoadMoreItems}
      >
        <!-- <Template key="featuredUsers" let:item>
          <UsersPreview items={item.users} class="h-5"/>
        </Template> -->
        <Template key="post-odd" let:item>
          <PostPreview on:postPreviewTap={onListItemTap} item={item} class="w-full h-40 mb-1 bg-slate-800 dark:bg-slate-800 text-slate-200 dark:text-slate-200"  />
        </Template>
        <Template key="post-even" let:item>
          <PostPreview on:postPreviewTap={onListItemTap} item={item} class="w-full h-40 mb-1 bg-slate-700 dark:bg-slate-700 text-slate-200 dark:text-slate-200"  />
        </Template>
      </collectionView>
    </pullrefresh>
  </gridLayout>
</page>
