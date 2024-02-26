<!-- @component Home page showing the default map and recent activity feed. -->

<script lang="ts">
  import { Page, View, EventData, Screen } from '@nativescript/core'
  import { GPS } from '@nativescript-community/gps'
  import { Drawer } from '@nativescript-community/ui-drawer'
  import Header from '~/components/Header.svelte'
  import HamburgerMenu from '~/components/HamburgerMenu.svelte'
  import Feed from '~/components/Feed.svelte'
  import Leaflet from '~/components/Leaflet.svelte'
  // import Theme from '@nativescript/theme' // to detect dark mode
  // import Footer from '~/components/Footer.svelte'
  import { ViewWatcher } from '~/stores/view'
  import { config } from '~/config/config'

  let gps: GPS

  // about the screen
  let pageRef: Page // reference to the current page
  let screenHeight: number = Screen.mainScreen.heightDIPs
  let screenWidth: number = Screen.mainScreen.widthDIPs
  let mapWatcher: ViewWatcher
  let feedWatcher: ViewWatcher

  // controls for the persistent bottom sheet
  let stepIndex = config.bottomSheet.startSnap
  let bottomSheetSteps = config.bottomSheet.snapPoints

  const pageLoad = (args: EventData) => {
    /**
     * This function is called when the page is navigated to.
     */
    pageRef = args.object as Page // save reference to the current page
    console.log(`screen w: ${screenWidth}, h: ${screenHeight}`)

    // watch for changes to the map and feed views
    const headerWatcher = new ViewWatcher(
      pageRef.getViewById('header'),
      'header',
    )
    mapWatcher = new ViewWatcher(pageRef.getViewById('map'), 'map')
    feedWatcher = new ViewWatcher(pageRef.getViewById('feed'), 'feed')
    feedWatcher.y.subscribe(y => {
      console.log(`feed - y: ${Math.round(y)}`)
      // mapWatcher.view.height = screenHeight - (screenHeight - y) // update map
    })
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

<page on:navigatingTo={pageLoad}>
  <Header id="header" onHamburger={toggleDrawer} />
  <bottomSheet
    id="bottomSheet"
    {stepIndex}
    bind:steps={bottomSheetSteps}
    on:stepIndexChange={onBottomSheetStepIndexChange}
  >
    <drawer bind:this={drawer} class="drawer h-full w-full">
      <HamburgerMenu prop:leftDrawer class="w-2/3 h-full" rows="*" {drawer} />
      <Leaflet
        id="map"
        prop:mainContent
        class="h-full w-full"
        page={pageRef}
        htmlFilePath="~/assets/leaflet.html"
      />
    </drawer>
    <Feed id="feed" prop:bottomSheet class="h-full w-full" />
  </bottomSheet>
</page>

<style>
</style>
