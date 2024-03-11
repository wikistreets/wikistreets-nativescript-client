<!-- @component Map page showing the leaflet map. -->
<script lang="ts">
  import { Screen, Application, Frame, Page, View, EventData, SwipeGestureEventData, SwipeDirection, Utils, on, Label } from '@nativescript/core'
  import { navigate, showModal, closeModal } from 'svelte-native'
  import { NativeElementNode, NativeViewElementNode } from 'svelte-native/dom';
  import { onMount, onDestroy } from 'svelte'
  import { get } from 'svelte/store'
  import { Drawer } from '@nativescript-community/ui-drawer'
  import Header from '~/components/Header.svelte'
  import HamburgerMenu from '~/components/HamburgerMenu.svelte'
  // import Feed from '~/components/Feed.svelte'
  import PostDetails from './PostDetails.svelte';
  import AuthModalFrame from '~/components/AuthModalFrame.svelte';
  import Leaflet from '~/components/Leaflet.svelte'
  // import Theme from '@nativescript/theme' // to detect dark mode
  // import Footer from '~/components/Footer.svelte'
  import { ViewWatcher } from '~/stores/view'
  import { FeatureService } from '../services/FeatureService'
  import { Feature, FeatureCollection as Collection } from '@turf/turf'
  import PostPreview from '~/components/PostPreview.svelte'
  import { icons } from '../utils/icons'
  import { config } from '~/config/config'
  import { geo, geoIsEnabled, solicitConsent as solicitGPSConsent } from '~/stores/geo'


  let parent: Frame | View
  let page: NativeViewElementNode<Page>; // bound to page
  let pageRef: Page // reference to the current page

  let unsubscribers: any[] = [] // will store any svelte stores we subscribe to

  // let mapWatcher: ViewWatcher
  // let feedWatcher: ViewWatcher
  // let headerWatcher: ViewWatcher

  // controls for the persistent bottom sheet
  // let stepIndex = config.bottomSheet.startSnap
  // let steps = config.bottomSheet.snapPoints

  // let feed: View
  let mapBbox: number[]
  let mapCenterPoint: Feature
  let mapZoom: number = config?.map?.defaults?.zoom || 12
  // let bottomSheet: View
  let posts: Feature[] // will hold posts fetched from API
  let collection: Collection // will hold a collection fetched from the API
  let fs: FeatureService

  let previewPost: Feature // a post the user has tapped on that we want to show preview of

  onMount(async () => {
    /**
     * Svelte hook when page is mounted
    */

    // subscribe to the geo location store and save the method to unsubscribe later
    unsubscribers.push(geo.subscribe((value) => {
      // console.log(`Map: geo update: ${JSON.stringify(value)}`)
    }))
    
    // fetch data to put into feed and map
    console.log("Map: onMount: Loading features...")
    fs = new FeatureService()
    posts = await fs.getMockFeatures() // mock data for now
    console.log(`Map: onMount: ${posts.length} posts`)
    collection = fs.collection // mock data for now
    mapBbox = fs.getBbox(collection)
    mapCenterPoint = fs.getCenter(collection)
    // console.log(JSON.stringify(bbox, null, 2))
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
    console.log(`Feed: onLoadMoreItems`)
    const newItems = await fs.getMockFeatures() // load more mock data
    console.log(`Feed: got ${newItems.length} more items`)
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
    pageRef = e.object as Page // save reference to the current page
    
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

    // watch for changes to the map and feed views
    // headerWatcher = headerWatcher ? headerWatcher : new ViewWatcher(
    //   pageRef.getViewById('header'),
    //   'header',
    // )
    // mapWatcher = (mapWatcher) ? mapWatcher : new ViewWatcher(page.getViewById('map'), 'map')
    // feedWatcher = feedWatcher ? feedWatcher : new ViewWatcher(page.getViewById('feed'), 'feed')
    // feedWatcher.y.subscribe(y => {
    //   console.log(`feed y: ${Math.round(y)}`)
    //   // mapWatcher.view.height = screenHeight - (screenHeight - y) // update map
    // })
  }

  const onGPSIconTap = (e: EventData) => {
    console.log(`Map: onGPSIconTap: currentLocation: ${JSON.stringify($geo)}`)
    if (!$geoIsEnabled) {
      console.log(`Map: onGPSIconTap: no location data`)
      solicitGPSConsent()
      return
    }
    // center the map on the user's location
    mapCenterPoint = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [$geo.longitude, $geo.latitude]
      }
    }
    // zoom in
    mapZoom = config.map.defaults.zoom
  }

  /**
   * Handler for when user clicks the icon to create a new post
   * @param e
   */
  const onCreatePost = (e?: EventData) => {
    console.log(`Map: onCreatePost`)
    showModal({
      page: AuthModalFrame,
      animated: true,
      props: {
        pageName: 'CreatePost',
        actionBarHidden: false,
      },
    })
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
      onCreatePost()
      // webViewInterface.emit('clearSelection')
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

  let drawer: Drawer

  function onOpenDrawer() {
    drawer.open()
  }
  function onCloseDrawer() {
    drawer.close()
  }
  function toggleDrawer() {
    drawer.toggle()
  }

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
  <actionBar title="Map" flat="true">
    <flexboxLayout class="w-full h-full mx-2" flexDirection="row" justifyContent="space-between">
      <label
        text="{icons.settings}"
        class="icons text-2xl icon text-left w-1/3"
        />
      <!-- <actionItem
        ios.position="left"
        android.position="actionBar"
        ios.systemIcon="32"
        android.systemIcon="ic_menu_preferences"
        on:tap={e => { console.log('settings icon click')}}
      /> -->
      <label text='Map' class="text-center text-lg w-1/3" />
      <!-- <searchBar id="searchbar" class="w-full bg-none text-lg p-2 ml-2 mr-6" hint="Search" /> -->
      <label
        text="{icons.share}"
        class="text-2xl icon text-right w-1/3"
        on:tap={e => { console.log('camera button click')}}
      />
      <!-- <actionItem
        ios.position="right"
        android.position="actionBar"
        ios.systemIcon="9"
        android.systemIcon="ic_menu_share"
        text="Cancel"
        on:tap={e => { console.log('share icon click')}}
      /> -->
    </flexboxLayout>
  </actionBar>
  <!-- <bottomSheet
    bind:this={bottomSheet}
    id="bottomSheet"
    {stepIndex}
    {steps}
    on:stepIndexChange={onBottomSheetStepIndexChange}
  > -->
    <drawer bind:this={drawer} class="drawer h-full w-full" on:start={onOpenDrawer} on:close={onCloseDrawer} > <!-- hamburger menu wrapper-->

      <HamburgerMenu prop:leftDrawer class="w-2/3 h-full" rows="*" {drawer} />
      <gridLayout rows="100, *, 100" columns="100, *, 100" prop:mainContent backgroundColor="red" class="w-full h-full">
        <Leaflet
          id="map"
          row="0"
          col="0"
          rowSpan="3"
          colSpan="3"
          class="h-full w-full z-1"
          page={pageRef}
          htmlFilePath="~/assets/leaflet.html"
          on:markerTap={onListItemTap}
          on:longPress={onMapLongPress} 
          on:mapTap={onMapTap}
          { posts }
          bbox={ mapBbox }
          centerPoint={ mapCenterPoint }
          zoom={ mapZoom }
          panToTappedMarker={true}
        />
        <label text="{icons['gps-dot']}" on:tap={onGPSIconTap} class="icon text-3xl text-center text-lg w-full text-slate-800" row="0" col="0" />
        <PostPreview visibility={previewPost ? 'visible' : 'hidden'} on:postPreviewTap={ ()=> { showPost(previewPost)} } on:swipe={onPreviewPostSwipe} item={previewPost} row={2} col={0} colSpan={3} class="w-11/12 mb-3 bg-slate-800 dark:bg-slate-800 text-slate-200 dark:text-slate-200"  />
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
