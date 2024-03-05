<!-- @component Top-most component that first loads. -->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { navigate } from 'svelte-native'
  import { Frame, Page, EventData } from '@nativescript/core'
  import * as geolocation from '@nativescript/geolocation'
  import { GeolocationService as GeoService } from './services/GeolocationService'
  import Map from './pages/Map.svelte'
  import BottomNavigation from '~/components/BottomNavigation.svelte'
  import { geoStore } from './stores/geo'

  // subscribe to gps location in data store
  let geo_value: any
  onDestroy(
    geoStore.lngLat.subscribe((lngLat: any) => {
      // location updated
      console.log(`lat: ${lngLat.lat}, lng: ${lngLat.lng}`) // debugging
      geo_value = lngLat
    }),
  )

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
  <page actionBarHidden={true} >
    <gridLayout rows="*, 60" class="w-full h-full">
        <contentView row="0">
          <frame id="mainFrame">
            <Map />
          </frame>
        </contentView>
        <contentView row="1">
          <frame id="navFrame">
            <BottomNavigation />
          </frame>
        </contentView>
    </gridLayout>
  </page>
</frame>