<!-- @component Log in form. -->

<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { navigate, showModal, closeModal } from 'svelte-native'
import { NativeViewElementNode } from 'svelte-native/dom'
import { Template } from 'svelte-native/components'
import { Frame, Page, View, SharedTransition, ModalTransition, ItemEventData, EventData, SwipeGestureEventData, SwipeDirection} from '@nativescript/core'
import { Drawer } from '@nativescript-community/ui-drawer'
import { PullToRefresh } from '@nativescript-community/ui-pulltorefresh'
import { Feature, Collection } from '~/models/feature'
import { FeatureService } from '../services/FeatureService'
import { l, lc } from '~/services/localeService'
import { icons } from '../utils/icons'
import { geo } from '~/stores/geo'
import PostPreview from '~/components/PostPreview.svelte'
import Feed from '~/pages/Feed.svelte'
import HamburgerMenu from '~/components/HamburgerMenu.svelte'
import PostDetails from '~/pages/PostDetails.svelte'

let isEditor = true // whether the user has permission to edit the collection
let isLoading = true // waiting for feed to load

let parent: Frame | View
let page: Page // reference to the current page
let drawer: Drawer

let unsubscribers: any[] = [] // will store any svelte stores we subscribe to

let posts: Feature[] = [] // will hold posts fetched from API
let collection: Collection // will hold a collection fetched from the API
let fs: FeatureService

// default collection, or lack thereof
export let selectedCollection: Collection = {
  _id: 0,
  title: lc('HamburgerMenu.collections.default'),
  type: 'FeatureCollection',
  features: []
}

onMount(async () => {
  /**
   * Svelte hook when page is mounted
  */
  console.log(`Feed: onMount`)

  // subscribe to the geo location store and save the method to unsubscribe later
  unsubscribers.push(geo.subscribe((value) => {
    // console.log(`Feed: geo.subscribe: ${JSON.stringify(value)}`)
  }))

  // fetch data to put into feed and map
  fs = new FeatureService()
  posts = await fs.getMockFeatures() // mock data for now
  isLoading = false
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

const onHamburgerIconTap = (e: EventData) => {
  console.log(`Map: onHamburgerIconTap`)
  // open the drawer
  drawer.toggle()
}

/**
 * For infinite scroll, called when collectionView needs more data
 * @param e
 */
const onLoadMoreItems = async (e: EventData) => {
  // infinite scroll... this method is called to load more data to the listView
  // console.log(`Feed: onLoadMoreItems`)
  const newItems = await fs.getMockFeatures() // load more mock data
  console.log(`Feed: got ${newItems.length} more items`)
  posts = posts.concat(newItems) // [...newItems, ...posts] // add to list
}

/**
 * Determine which template to use for each list item
 * @param item
 * @param index
 * @param items
 */
const itemTemplateSelector = (item: any, index: number, items: any[]): string => {
  // different list item keys for even and odd rows
  
    // special types
  // if (item.type == 'featuredUsers'){ 
  //   return 'featuredUsers'
  // }
  // regular posts
  return index % 2 === 0 ? 'post-even' : 'post-odd' // regular post types
}

/**
 * Determine how many columns each list item will span
 * @param item
 * @param _index
 */
const spanSizeSelector = (item: any, _index: number): number => {
    return 1; // all items in list are full width
}

/**
 * Called when user tries to reorder a list item to determine whether its allowed
 * @param e
 */
const onItemReorderStarting = (e: any) => {
  // set e.returnValue to true or false to allow or cancel the reorder
  e.returnValue = isEditor
}

/**
 * Called when user starts reordering the list
 * @param e: CollectionViewEventData
 */
const onItemReorderStarted = ({ object, index, item }) => {
  // console.log(`Feed: onItemReorderStarted: id->${item._id}, index->${index}`)
}

/**
 * Called when user finishes reordering the list
 * @param e: CollectionViewEventData
 */
const onItemReordered = ({ object, index, item, data }) => {
  const newIndex = data.targetIndex
  if (newIndex < 0) return // user abandonded reorder
  console.log(`Feed: onItemReorderStarted: id->${item._id}, oldIndex->${index}, newIndex->${newIndex}`)
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

function onOpenDrawer() {
  drawer.open()
}
function onCloseDrawer() {
  drawer.close()
}
function toggleDrawer() {
  drawer.toggle()
}

</script>
  
<page actionBarHidden={false} class="w-full h-full" {...$$restProps}>
  <actionBar title="{selectedCollection.title}" flat="true">
    <gridLayout columns="auto, *, auto" class="w-full h-full mx-2">
      <label col={0} text="{icons.menu}" on:tap={onHamburgerIconTap} class="icons text-2xl icon text-left" />
      <label col={1} text='{selectedCollection.title}' class="w-full text-center text-lg" />
      <label col={2} text="{icons.share}" class="text-2xl icon text-right" on:tap={e => { console.log('share button click')}} />
    </gridLayout>
  </actionBar>
  
  <drawer bind:this={drawer} class="drawer h-full w-full" on:start={onOpenDrawer} on:close={onCloseDrawer} > <!-- hamburger menu wrapper-->

    <HamburgerMenu prop:leftDrawer class="w-2/3 h-full" {drawer} collectionPage={Feed} />

    <gridLayout {...$$restProps} prop:mainContent>
      <!-- <label
        class="py-4 text-center text-md text-white bg-slate-600 rounded-t-lg"
        text={feedbackMessage}
      /> -->
      <activityIndicator visibility={isLoading ? 'visible' : 'hidden'} busy={isLoading} class='w-full h-full' />
      <pullrefresh visibility={isLoading ? 'hidden' : 'visible'} bind:this={pullRefresh} on:refresh={refresh} indicatorFillColor="#f1f5f9" indicatorColor="#000">
        <collectionView 
          separatorColor="transparent"
          items={posts}
          itemTemplateSelector={itemTemplateSelector}
          colWidth="100%"
          spanSize={spanSizeSelector}
          automationText="collectionView"
          reorderEnabled={true}
          reorderLongPressEnabled={true}
          on:itemReorderStarting={onItemReorderStarting}
          on:itemReorderStarted={onItemReorderStarted}
          on:itemReordered={onItemReordered}
          on:loadMoreItems={onLoadMoreItems}
          on:swipe={e => { console.log(`Feed: swipe`) }}
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
    
  </drawer>

</page>
