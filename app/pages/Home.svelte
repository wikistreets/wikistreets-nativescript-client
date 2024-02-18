<!-- @component Home page showing the default map and recent activity feed. -->

<script lang="ts">
  import { Frame, Page, Observable, EventData } from '@nativescript/core'
  import Header from '../components/Header.svelte'
  import Feed from '../components/Feed.svelte'
  import Leaflet from '../components/Leaflet.svelte'
  import Theme from '@nativescript/theme' // to detect dark mode
  import Footer from '~/components/Footer.svelte'

  // get a reference to the current page to pass to child components
  let pageRef: Page
  const pageLoad = (args: EventData) => {
    pageRef = args.object as Page
    console.log(`page: ${pageRef}`)
  }
</script>

<page on:navigatingTo={pageLoad}>
  <Header />
  <gridLayout rows="2*, 3*">
    <Leaflet page={pageRef} row="0" htmlFilePath="~/assets/leaflet.html" />
    <Feed row="1" />
  </gridLayout>
</page>

<style>
  /* actionBar {
    background-color: black;
    color: white;
  }
  actionBar label {
    color: white;
  } */
</style>
