<!-- @component Map page showing the leaflet map. -->
<script lang="ts">
import { Screen, Application, Frame, Page, View, EventData, SwipeGestureEventData, SwipeDirection, Utils, on, Label, GridLayout } from '@nativescript/core'
import { navigate, showModal, closeModal } from 'svelte-native'
import { NativeElementNode, NativeViewElementNode } from 'svelte-native/dom';
import { onMount, onDestroy } from 'svelte'
import { Drawer } from '@nativescript-community/ui-drawer'
// import Theme from '@nativescript/theme' // to detect dark mode
import { l, lc } from '~/services/localeService'
import { Collection, Feature } from '~/models/feature'
import { icons } from '../utils/icons'
import { config } from '~/config/config'
import { geo, geoIsEnabled, solicitConsent as solicitGPSConsent } from '~/stores/geo'
import { FeatureService } from '../services/FeatureService'
import HamburgerMenu from '~/components/HamburgerMenu.svelte'
import Leaflet from '~/components/Leaflet.svelte'
import Map from '~/pages/Map.svelte'
import PostPreview from '~/components/PostPreview.svelte'
import PostDetails from '~/pages/PostDetails.svelte';
// import Footer from '~/components/Footer.svelte'


let parent: Frame | View
let page: Page // reference to the current page
let drawer: Drawer


let unsubscribers: any[] = [] // will store any svelte stores we subscribe to

// let mapWatcher: ViewWatcher
// let feedWatcher: ViewWatcher
// let headerWatcher: ViewWatcher

// controls for the persistent bottom sheet
// let stepIndex = config.bottomSheet.startSnap
// let steps = config.bottomSheet.snapPoints

// let feed: View
let mapBbox: number[]
let mapCenterPoint: Feature // centerpoint of map
let homePoint: Feature // user's geolocation
let isHomeVisible: boolean = false // whether to show the home marker
let mapAutoHoming: boolean = false // whether to center on the homePoint
let mapZoom: number = config?.map?.defaults?.zoom
let geoUnsubscribe: any // will hold the method to unsubscribe from the geo store

// let bottomSheet: View
let posts: Feature[] // will hold posts fetched from API
let collection: Collection // will hold a collection fetched from the API
let fs: FeatureService

$: console.log(`Map: mapAutoHoming: ${mapAutoHoming}`)

let previewPost: Feature // a post the user has tapped on that we want to show preview of

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

  // fetch data to put into feed and map
  // console.log("Map: onMount: Loading features...")
  fs = new FeatureService()
  posts = await fs.getMockFeatures() // mock data for now
  console.log(`Map: onMount: ${posts.length} posts`)
  collection = fs.collection // mock data for now
  mapBbox = fs.getBbox(collection)
  mapCenterPoint = fs.getCenter(collection)
})

onDestroy(() => {
  console.log(`Map: onDestroy`)
  // unsubscribe from any subscribed svelte stores
  unsubscribers.forEach((unsubscribe) => { unsubscribe() })
})

/**
 * For infinite scroll, called when we need more postPreview items
 * @param e
 */
const onLoadMoreItems = async (e: EventData) => {
  // infinite scroll... this method is called to load more data to the listView
  // console.log(`Feed: onLoadMoreItems`)
  const newItems = await fs.getMockFeatures() // load more mock data
  console.log(`Feed: onLoadMoreItems: got ${newItems.length} more items`)
  posts = posts.concat(newItems) // [...newItems, ...posts] // add to list
}

/**
 * Handler for page load event
 * @param e
 */
const onPageLoad = (e: EventData) => {
  /**
   * Nativescript callback when page is loaded
   */
  console.log(`Map: onPageLoad`)
  page = e.object as Page // save reference to the current page
  
  parent = Frame.topmost() || Application.getRootView()
  // console.log(`page: ${page}, parent: ${parent}`)
  // console.log(`screen w: ${screenWidth}, h: ${screenHeight}`)

  // get rid of any keyboard... this may cause bugs on android... not sure
  if (__ANDROID__) {
    setTimeout(() => {
      Utils.dismissKeyboard()
      Utils.dismissSoftInput()
    }, 100)
  }

}

const stopGeoTracking = () => {
    // already tracking geolocation, so stop it
    console.log(`Map: unsubscribing from geo`)
    mapAutoHoming = false
    isHomeVisible = false
    geoUnsubscribe()
    geoUnsubscribe = null
}

const onGPSIconTap = (e: EventData) => {
  // console.log(`Map: onGPSIconTap: currentLocation: ${JSON.stringify($geo)}`)
  if (geoUnsubscribe) {
    stopGeoTracking()
    return
  }

  // subscribe to the geo location store and save the method to unsubscribe later
  console.log('Map: subscribing to geo')
  mapAutoHoming = true // center the map on the user's location
  isHomeVisible = true // show the home marker
  mapZoom = config.map.defaults.homingZoom // zoom in
  geoUnsubscribe = geo.subscribe((newGeo) => {
    // console.log(`Map: geo update: ${JSON.stringify(newGeo)}`)
    // center the map on the user's location
    homePoint = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [newGeo.longitude, newGeo.latitude]
      }
    }
    if (mapAutoHoming) mapCenterPoint = homePoint // center the map on the user's location, if desired
  }) // geo.subscribe
  unsubscribers.push(geoUnsubscribe) // save in subscription list for remove onDestroy

  // if (!$geoIsEnabled) {
  //   console.log(`Map: onGPSIconTap: no location data`)
  //   solicitGPSConsent()
  //   return
  // }

}

const onHamburgerIconTap = (e: EventData) => {
  console.log(`Map: onHamburgerIconTap`)
  // open the drawer
  drawer.toggle()
}

const getPrevious = (post: Feature): Feature => {
  // return the previous post before this one
  const index: number = posts.indexOf(post)
  let prevIndex = index - 1
  prevIndex = (prevIndex >= 0) ? prevIndex : posts.length - 1 // reset to last index if below zero
  const newPost: Feature = posts[prevIndex]
  return newPost
}
const getNext = async (post: Feature): Promise<Feature> => {
  // return the next post after this one
  const index = posts.indexOf(post)
  console.log(`getNext: index: ${index}, posts.length: ${posts.length}`)
  if (index >= 0 && index == posts.length - 3) {
    await onLoadMoreItems(null) // attempt infiniteScroll
  }
  let nextIndex = index + 1
  nextIndex = (nextIndex < posts.length) ? nextIndex : 0 // reset to zero if beyond length of post
  const newPost: Feature = posts[nextIndex]
  return newPost
}
const onPreviewPostSwipe = async (e: any) => {
  // user has swiped the preview post
  // console.log(`swiping start on post ${previewPost._id}`)
  switch (e.direction) {
    case SwipeDirection.right:
      console.log('onPreviewPostSwipe: right')
      previewPost = getPrevious(previewPost)
      mapCenterPoint = previewPost
      // console.log(`centering on post ${previewPost._id} at ${previewPost.geometry.coordinates} `)
      break
    case SwipeDirection.left:
      console.log('onPreviewPostSwipe: left')
      previewPost = await getNext(previewPost)
      mapCenterPoint = previewPost
      // console.log(`centering on post ${previewPost._id} at ${previewPost.geometry.coordinates} `)
      break
    case SwipeDirection.down:
      console.log('onPreviewPostSwipe: down')
      previewPost = await getNext(previewPost)
      mapCenterPoint = previewPost
      break
    case SwipeDirection.up:
      console.log('onPreviewPostSwipe: up')
      previewPost = getPrevious(previewPost)
      mapCenterPoint = previewPost
      break
    default:
      console.log(`unknown swipe direction: ${e.direction}`)
  }
  stopGeoTracking() // stop tracking the user's location
  // console.log(`swiping end on post ${previewPost._id}`)
}

const onListItemTap = (e: CustomEvent) => {
  console.log(`Map: onListItemTap: post ${e.detail.detail.postId}`)
  // console.log(`Map.svelte: onMarkerTap ${JSON.stringify(e)}`)
  const postId = e.detail.detail.postId // get the post id from the event... it seems to be double-wrapped in a recursive detail field
  const post: Feature = posts.find((p) => p._id === postId)
  previewPost = post
}

const onMapTap = (e: CustomEvent) => {
  console.log(`Map: onMapTap`)
  previewPost = null // clear the preview
}

const showPost = (post: Feature) => {
  console.log(`Map: showPost: ${post._id}`)
  navigate({
    frame: Frame.getFrameById('mainFrame'),
    page: PostDetails,
    props: { post: post },
    clearHistory: false,
    backstackVisible: false,
    transition: {
      name: 'slideLeft', // (__ANDROID__) ? 'slideLeft' : 'flipLeft', // slide | explode | fade | flipRight | flipLeft | slideLeft | slideRight | slideTop | slideBottom
      duration: 300,
      curve: 'spring' // ease | easeIn | easeInOut | easeOut | linear | spring
    }
  })
}

/**
 * Handler for a long press on the Leaflet component
 * @param e a Svelte event, which follows the CustomEvent API standard (https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
 */
const onMapLongPress = (e: CustomEvent) => {
    console.log(`Map: onMapLongPress`)
    // navigate to new post page
    // navigate({
    //   frame: Frame.getFrameById('topmost'),
    //   page: NewPostSeletcLocation,
    //   clearHistory: false,
    //   animated: false,
    // })
}


const onMapMove = async (e: CustomEvent) => {
  // console.log('onMapMove')
}

const onMapZoom = (e: CustomEvent) => {
  // console.log('onMapZoom')
}

const onMapDragStart = () => {
  // console.log('onMapDragStart')
  mapAutoHoming = false // stop auto-centering on user's current location
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

// function nextStep() {
//   // increment step index but return to zero if at end
//   stepIndex = stepIndex === steps.length - 1 ? 0 : stepIndex + 1
//   console.log(`step: ${stepIndex} -> ${steps[stepIndex]}`)
// }

// function onBottomSheetStepIndexChange(e) {
//   stepIndex = e.value
//   // console.log(`bottomSheet stepIndex: ${stepIndex}`)
//   const feed = pageRef.getViewById('feed') as View
//   feedWatcher.y.set(feed.getLocationOnScreen().y) // update the feedWatcher
// }


// not using the below... but here for reference
// const oldOnHambuerger = () => {
//   $: {
//       if (isModal) {
//           menuIcon = 'mdi-close';
//       } else {
//           menuIcon = canGoBack ? (__IOS__ ? 'mdi-chevron-left' : 'mdi-arrow-left') : 'mdi-menu';
//       }
//   }
//   $: menuIconVisible = ((canGoBack || isModal) && !disableBackButton) || showMenuIcon;
//   $: menuIconVisibility = menuIconVisible ? 'visible' : 'collapse';
// }
</script>

<page on:navigatingTo={onPageLoad} actionBarHidden={false} >
  <actionBar title="{selectedCollection.title}" flat="true">
    <gridLayout columns="auto, *, auto" class="w-full h-full mx-2">
      <label col={0} text="{icons.menu}" on:tap={onHamburgerIconTap} class="icons text-2xl icon text-left" />
      <label col={1} text='{selectedCollection.title}' class="w-full text-center text-heading-sm" />
      <label col={2} text="{icons.share}" class="text-2xl icon text-right" on:tap={e => { console.log('share button click')}} />
    </gridLayout>
  </actionBar>
  <!-- <bottomSheet
    bind:this={bottomSheet}
    id="bottomSheet"
    {stepIndex}
    {steps}
    on:stepIndexChange={onBottomSheetStepIndexChange}
  > -->
    <drawer bind:this={drawer} class="drawer h-full w-full" on:start={onOpenDrawer} on:close={onCloseDrawer} > <!-- hamburger menu wrapper-->

      <HamburgerMenu prop:leftDrawer class="w-2/3 h-full" {drawer} collectionPage={Map} />

      <gridLayout rows="100, 70, *, 70, 100" columns="100, 70, *, 70, 100" prop:mainContent backgroundColor="red" class="w-full h-full">
        <Leaflet
          id="map"
          row="0"
          col="0"
          rowSpan="5"
          colSpan="5"
          class="h-full w-full z-1"
          htmlFilePath="~/assets/leaflet.html"
          attributionControl={false}
          { posts }
          bbox={ mapBbox }
          bind:centerPoint={ mapCenterPoint }
          bind:homePoint={ homePoint }
          bind:isHomeVisible={ isHomeVisible }
          bind:zoom={ mapZoom }
          panToMapTapPoint={false}
          panToTappedMarker={true}
          on:markerTap={onListItemTap}
          on:longPress={onMapLongPress} 
          on:mapTap={onMapTap}
          on:mapMove={onMapMove}
          on:mapZoom={onMapZoom}
          on:dragStart={onMapDragStart}
/>
       
        <label text="{icons['navigation']}" on:tap={onGPSIconTap} style="margin-left: 0; margin-right: 10rem; margin-top: 0; margin-bottom: 24rem; transform: rotate(40);" class="icon text-2xl text-right {geoUnsubscribe ? 'text-t-light-primary' : 'text-t-light-secondary'}" row="3" col={4} />
         
        <PostPreview visibility={previewPost ? 'visible' : 'hidden'} on:postPreviewTap={ ()=> { showPost(previewPost)} } on:swipe={onPreviewPostSwipe} item={previewPost} row={4} col={0} colSpan={5} style="margin-bottom: 10rem; margin-top: 0; margin-left: 0; margin-right: 0; border-radius: 5rem;" class="w-11/12 bg-white dark:bg-s-dark-primary" />
      </gridLayout>
    </drawer>
    <!-- <Feed
      id="feed"
      bind:this={feed}
      prop:bottomSheet
      class="h-full w-full"
      { posts }
      on:listItemTap={onListItemTap}
      onGripTap={nextStep}
    /> -->
  <!-- </bottomSheet> -->
</page>

<style>
</style>
