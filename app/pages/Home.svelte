<script lang="ts">
  import Header from '../components/Header.svelte'
  import Feed from '../components/Feed.svelte'
  import { GeolocationService } from '../services/GeolocationService'

  // get high acuracy GPS
  const geoLoc: any = GeolocationService.getCurrentLocation()
  console.log(`Geolocation: ${geoLoc?.longitude}, ${geoLoc?.latitude}`)
</script>

<page>
  <Header />

  <gridLayout rows="auto, *">
    <Feed />
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
