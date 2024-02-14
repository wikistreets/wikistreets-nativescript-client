<script lang="ts">
  import { Frame, Page, Observable, EventData } from '@nativescript/core'
  import Header from '../components/Header.svelte'
  import Feed from '../components/Feed.svelte'
  import Leaflet from '../components/Leaflet.svelte'
  import { GeolocationService } from '../services/GeolocationService'

  // get high acuracy GPS
  const geoLoc: any = GeolocationService.getCurrentLocationHighAccuracySync() // what it sounds like
  console.log(`Geolocation: ${geoLoc.latitude}, ${geoLoc.longitude}`)

  // get a reference to the current page to pass to child components
  let pageRef: Page
  const pageLoad = (args: EventData) => {
    pageRef = args.object as Page
    console.log(`page: ${pageRef}`)
  }
</script>

<page on:navigatingTo={pageLoad}>
  <Header />

  <gridLayout rows="1*, 3*">
    <Leaflet row="0" {pageRef} />
    <Feed row="1" {pageRef} />
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
