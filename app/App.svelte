<!-- @component Top-most component that first loads. -->

<script lang="ts">
  import * as geolocation from '@nativescript/geolocation'
  import { GeolocationService as GeoService } from './services/GeolocationService'
  import Home from './pages/Home.svelte'
  import { onDestroy } from 'svelte'
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
  <Home />
</frame>
