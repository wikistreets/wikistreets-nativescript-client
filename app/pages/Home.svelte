<!-- @component Home page showing the default map and recent activity feed. -->

<script lang="ts">
  import { Application, Frame, Page, View, EventData, Screen, on } from '@nativescript/core'
  import { navigate, showModal } from 'svelte-native'
  import { NativeElementNode, NativeViewElementNode } from 'svelte-native/dom';
  import { onMount } from 'svelte'
  import { get } from 'svelte/store'
  import { GPS } from '@nativescript-community/gps'
  import { Drawer } from '@nativescript-community/ui-drawer'
  import Header from '~/components/Header.svelte'
  import HamburgerMenu from '~/components/HamburgerMenu.svelte'
  import Feed from '~/components/Feed.svelte'
  import PostDetails from './PostDetails.svelte';
  import Leaflet from '~/components/Leaflet.svelte'
  // import Theme from '@nativescript/theme' // to detect dark mode
  // import Footer from '~/components/Footer.svelte'
  import { ViewWatcher } from '~/stores/view'
  import { FeatureService } from '../services/FeatureService'
  import { config } from '~/config/config'

  let parent: Frame | View
  let page: NativeViewElementNode<Page>; // bound to page
  let pageRef: Page // reference to the current page

  let gps: GPS

  // about the screen
  let screenHeight: number = Screen.mainScreen.heightDIPs
  let screenWidth: number = Screen.mainScreen.widthDIPs
  let mapWatcher: ViewWatcher
  let feedWatcher: ViewWatcher

  // controls for the persistent bottom sheet
  let stepIndex = config.bottomSheet.startSnap
  let steps = config.bottomSheet.snapPoints

  let feed: View
  let map: View
  let bottomSheet: View
  let posts: any[] = [] // will hold posts fetched from API

  onMount(() => {
    /**
     * Svelte hook when page is mounted
    */

    // fetch data to put into feed and map
    posts = FeatureService.getInstance().getFeatures() // mock data for now
  })

  const onPageLoad = (e: EventData) => {
    /**
     * Nativescript callback when page is loaded
     */
    pageRef = e.object as Page // save reference to the current page
    // pageRef = page.nativeElement
    // console.log(`onPageLoad`)
    
    parent = Frame.topmost() || Application.getRootView()
    console.log(`page: ${page}, parent: ${parent}`)
    // console.log(`screen w: ${screenWidth}, h: ${screenHeight}`)

    // watch for changes to the map and feed views
    const headerWatcher = new ViewWatcher(
      pageRef.getViewById('header'),
      'header',
    )
    mapWatcher = new ViewWatcher(pageRef.getViewById('map'), 'map')
    feedWatcher = new ViewWatcher(pageRef.getViewById('feed'), 'feed')
    feedWatcher.y.subscribe(y => {
      console.log(`feed y: ${Math.round(y)}`)
      // mapWatcher.view.height = screenHeight - (screenHeight - y) // update map
    })
    
  }

  const onListItemTap = (e: any) => {
    console.log(`Home.svelte: onMarkerTap ${JSON.stringify(e)}`)
    const postId = e.detail.detail.postId // get the post id from the event... it seems to be double-wrapped in a recursive detail field
    navigate({
      page: PostDetails,
      props: { postId },
      clearHistory: false,
      backstackVisible: false,
      transition: {
        name: 'flipLeft', // slide | explode | fade | flipRight | flipLeft | slideLeft | slideRight | slideTop | slideBottom
        duration: 300,
        curve: 'spring' // ease | easeIn | easeInOut | easeOut | linear | spring
      }
    })

    // showModal({
    //   target: parent,
    //   page: PostDetails,
    //   animated: true,
    //   fullscreen: false,
    //   stretched: true,
    //   props: {
    //     postId
    //   },
    // })
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
</script>

<page bind:this={page}  on:navigatingTo={onPageLoad} actionBarHidden={true}>
  <Header id="header" onHamburger={toggleDrawer} />
  <bottomSheet
    bind:this={bottomSheet}
    id="bottomSheet"
    {stepIndex}
    {steps}
    on:stepIndexChange={onBottomSheetStepIndexChange}
  > <!-- feed wrapper -->
    <drawer bind:this={drawer} class="drawer h-full w-full" on:start={onOpenDrawer} on:close={onCloseDrawer} > <!-- hamburger menu wrapper-->

      <HamburgerMenu prop:leftDrawer class="w-2/3 h-full" rows="*" {drawer} />
      <Leaflet
        id="map"
        prop:mainContent
        class="h-full w-full"
        page={pageRef}
        htmlFilePath="~/assets/leaflet.html"
        bind:this={map}
        on:markerTap={onListItemTap}
        { posts }
      />
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
