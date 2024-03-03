<!-- @component Home page showing the default map and recent activity feed. -->
<script lang="ts">
  import { Screen, Application, Frame, Page, View, EventData, Utils, on, Label } from '@nativescript/core'
  import { navigate, showModal, closeModal } from 'svelte-native'
  import { NativeElementNode, NativeViewElementNode } from 'svelte-native/dom';
  import { onMount } from 'svelte'
  import { get } from 'svelte/store'
  import { GPS } from '@nativescript-community/gps'
  import { Drawer } from '@nativescript-community/ui-drawer'
  import Header from '~/components/Header.svelte'
  import HamburgerMenu from '~/components/HamburgerMenu.svelte'
  import Feed from '~/components/Feed.svelte'
  import PostDetails from './PostDetails.svelte';
  import AuthModalFrame from '~/components/AuthModalFrame.svelte';
  import Leaflet from '~/components/Leaflet.svelte'
  // import Theme from '@nativescript/theme' // to detect dark mode
  // import Footer from '~/components/Footer.svelte'
  import { ViewWatcher } from '~/stores/view'
  import { FeatureService } from '../services/FeatureService'
  import { Feature, FeatureCollection as Collection } from '@turf/turf'
  import { icons } from '../utils/icons'
  import { config } from '~/config/config'


  let parent: Frame | View
  let page: NativeViewElementNode<Page>; // bound to page
  let pageRef: Page // reference to the current page

  let gps: GPS

  // screen dimensions
  let screenHeight: number = Screen.mainScreen.heightDIPs
  let screenWidth: number = Screen.mainScreen.widthDIPs
  let centerX: number
  let centerY: number
  $: centerX = screenWidth / 2
  $: centerY = screenHeight / 2

  // let mapWatcher: ViewWatcher
  let feedWatcher: ViewWatcher
  // let headerWatcher: ViewWatcher

  // controls for the persistent bottom sheet
  let stepIndex = config.bottomSheet.startSnap
  let steps = config.bottomSheet.snapPoints

  let feed: View
  let map: View
  // let mapVisibility = 'visible' // 'visible' | 'collapsed' | 'hidden'
  let mapBbox: number[]
  let mapCenterPoint: any
  let bottomSheet: View
  let posts: Feature[] = [] // will hold posts fetched from API
  let collection: Collection // will hold a collection fetched from the API
  const fs = FeatureService.getInstance()

  onMount(() => {
    /**
     * Svelte hook when page is mounted
    */

    // fetch data to put into feed and map
    posts = fs.getFeatures() // mock data for now
    collection = fs.getCollection() // mock data for now
    mapBbox = fs.getBbox(collection)
    mapCenterPoint = fs.getCenter(collection)
    // console.log(JSON.stringify(bbox, null, 2))
  })

  /**
   * Handler for page load event
   * @param e
   */
  const onPageLoad = (e: EventData) => {
    /**
     * Nativescript callback when page is loaded
     */
    pageRef = e.object as Page // save reference to the current page
    // pageRef = page.nativeElement
    // console.log(`onPageLoad`)
    
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
    // mapWatcher = (mapWatcher) ? mapWatcher : new ViewWatcher(pageRef.getViewById('map'), 'map')
    feedWatcher = feedWatcher ? feedWatcher : new ViewWatcher(pageRef.getViewById('feed'), 'feed')
    // feedWatcher.y.subscribe(y => {
    //   console.log(`feed y: ${Math.round(y)}`)
    //   // mapWatcher.view.height = screenHeight - (screenHeight - y) // update map
    // })
  }

  /**
   * Handler for when user clicks the icon to create a new post
   * @param e
   */
  const onCreatePost = (e?: EventData) => {
    console.log(`Create post!`)
    showModal({
      page: AuthModalFrame,
      animated: true,
      props: {
        pageName: 'CreatePost',
        actionBarHidden: false,
      },
    })
  }

  const onListItemTap = (e: CustomEvent) => {
    // console.log(`Home.svelte: onMarkerTap ${JSON.stringify(e)}`)
    const postId = e.detail.detail.postId // get the post id from the event... it seems to be double-wrapped in a recursive detail field

    // navigate({
    //   page: PostDetails,
    //   props: { postId },
    //   clearHistory: false,
    //   backstackVisible: false,
    //   transition: {
    //     name: (__ANDROID__) ? 'slideLeft' : 'flipLeft', // slide | explode | fade | flipRight | flipLeft | slideLeft | slideRight | slideTop | slideBottom
    //     duration: 300,
    //     curve: 'spring' // ease | easeIn | easeInOut | easeOut | linear | spring
    //   }
    // })

    // drawer.close()
    showModal({
      page: AuthModalFrame,
      animated: true,
      props: {
        postId,
        pageName: 'PostDetails',
        actionBarHidden: false,
      },
    })
    // showModal({
    //   target: parent,
    //   page: PostDetails,
    //   animated: true,
    //   fullscreen: false,
    //   stretched: true,
    //   props: {
    //     postId
    //   }
    // })    
  }

  /**
   * Handler for a long press on the Leaflet component
   * @param e a Svelte event, which follows the CustomEvent API standard (https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
   */
  const onMapLongPress = (e: CustomEvent) => {
      console.log(`Long press!`)
      onCreatePost()
      // webViewInterface.emit('clearSelection')
  }

  function nextStep() {
    // increment step index but return to zero if at end
    stepIndex = stepIndex === steps.length - 1 ? 0 : stepIndex + 1
    console.log(`step: ${stepIndex} -> ${steps[stepIndex]}`)
  }

  function onBottomSheetStepIndexChange(e) {
    stepIndex = e.value
    // console.log(`bottomSheet stepIndex: ${stepIndex}`)
    const feed = pageRef.getViewById('feed') as View
    feedWatcher.y.set(feed.getLocationOnScreen().y) // update the feedWatcher
  }

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

<page bind:this={page} on:navigatingTo={onPageLoad} actionBarHidden={true} >
  <!-- <Header id="header" on:hamburger={toggleDrawer} /> -->
  <bottomSheet
    bind:this={bottomSheet}
    id="bottomSheet"
    {stepIndex}
    {steps}
    on:stepIndexChange={onBottomSheetStepIndexChange}
  > <!-- feed wrapper -->
    <drawer bind:this={drawer} class="drawer h-full w-full" on:start={onOpenDrawer} on:close={onCloseDrawer} > <!-- hamburger menu wrapper-->

      <HamburgerMenu prop:leftDrawer class="w-2/3 h-full" rows="*" {drawer} />
      <absoluteLayout prop:mainContent backgroundColor="red" class="w-full h-full">
        <!-- <label top="10" left={centerX} backgroundColor="blue" text="Leaflet" class="bg-red-800 text-lg text-center m-0 p-4 z-10" /> -->
        <Leaflet
          id="map"
          class="h-full w-full z-1"
          page={pageRef}
          htmlFilePath="~/assets/leaflet.html"
          bind:this={map}
          on:markerTap={onListItemTap}
          on:longPress={onMapLongPress} 
          { posts }
          bbox={ mapBbox }
          centerPoint={ mapCenterPoint }
        />
        <Header id="header" class="w-full m-2" on:hamburger={toggleDrawer} />

        <!-- eventually replace + sign with real icon-->
        <label top={screenHeight-160} left={centerX-25} text="+" class="w-15 h-15 p-5 text-center text-xl icon text-white bg-black z-10" on:tap={onCreatePost}/>

        <!-- trying out a listPicker -->
        <!-- <listPicker items={['one', 'two', 'three', 'four', 'five', 'six', 'seven']} class="text-black bg-white w-full" left="0" top={screenHeight - 300} /> -->

      </absoluteLayout>
    </drawer>
    <Feed
      id="feed"
      bind:this={feed}
      prop:bottomSheet
      class="h-full w-full"
      { posts }
      on:listItemTap={onListItemTap}
      onGripTap={nextStep}
    />
  </bottomSheet>
</page>

<style>
</style>
