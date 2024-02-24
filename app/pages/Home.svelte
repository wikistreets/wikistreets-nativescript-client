<!-- @component Home page showing the default map and recent activity feed. -->

<script lang="ts">
  import { Frame, Page, Observable, EventData } from '@nativescript/core'
  import { GPS } from '@nativescript-community/gps'
  import { Drawer } from '@nativescript-community/ui-drawer'
  import Header from '~/components/Header.svelte'
  import HamburgerMenu from '~/components/HamburgerMenu.svelte'
  import Feed from '~/components/Feed.svelte'
  import Leaflet from '~/components/Leaflet.svelte'
  import Theme from '@nativescript/theme' // to detect dark mode
  import Footer from '~/components/Footer.svelte'

  let gps: GPS

  // get a reference to the current page to pass to child components
  let pageRef: Page
  const pageLoad = (args: EventData) => {
    pageRef = args.object as Page
    console.log(`page: ${pageRef}`)
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
  <Header onHamburger={toggleDrawer} />

  <drawer bind:this={drawer} class="drawer">
    <HamburgerMenu prop:leftDrawer class="w-2/3 h-full" rows="*" {drawer} />
    <gridLayout prop:mainContent rows="2*, 3*" class="h-full">
      <Leaflet page={pageRef} htmlFilePath="~/assets/leaflet.html" row="0" />
      <Feed row="1" />
    </gridLayout>
  </drawer>
</page>

<style>
</style>
