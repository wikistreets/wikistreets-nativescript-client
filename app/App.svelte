<!-- @component Top-most component that first loads. -->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { navigate } from 'svelte-native'
  import { Frame, Page, EventData, View } from '@nativescript/core'
  import * as geolocation from '@nativescript/geolocation'
  import { GeolocationService as GeoService } from './services/GeolocationService'
  import Map from './pages/Map.svelte'
  import BottomNavigation from '~/components/BottomNavigation.svelte'
  import { geoStore } from './stores/geo'

  let geo_value: any
  let page: Page
  let bottomNav: Page

  onMount(() => {
    console.log(`App: onMount()`)
    // subscribe to gps location in data store
    geoStore.lngLat.subscribe((lngLat: any) => {
      // location updated
      console.log(`lat: ${lngLat.lat}, lng: ${lngLat.lng}`) // debugging
      geo_value = lngLat
    })
  })
  onDestroy(() => {
    console.log(`App: onDestroy()`)
  })
  const onPageLoad = (e: EventData) => {
    console.log(`App: onPageLoad`)
    page = e.object as Page
    bottomNav = page.getViewById('bottomNav') as Page
  }

  // request high acuracy GPS
  GeoService.getCurrentLocation(GeoService.DEFAULT_LOCATION_SETTINGS).then(
    (geoLoc: geolocation.Location) => {
      // we've got the user's geolocation
      geoStore.lngLat.set({
        lat: geoLoc.latitude,
        lng: geoLoc.longitude,
      })
    },
  )

</script>

<frame>
  <page actionBarHidden={true} on:loaded={onPageLoad}>
    <gridLayout rows="*, 60" class="w-full h-full">
        <contentView row="0">
          <frame id="mainFrame">
            <Map />
          </frame>
        </contentView>
        <contentView row="1">
          <frame id="navFrame">
            <BottomNavigation id="bottomNav" />
          </frame>
        </contentView>
    </gridLayout>
  </page>
</frame>