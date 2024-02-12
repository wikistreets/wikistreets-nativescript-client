<script lang="ts">
  import * as geolocation from '@nativescript/geolocation'
  import { CoreTypes } from '@nativescript/core' // for high accuracy gps
  import { icons } from '../utils/icons'
  import Feed from '../components/Feed.svelte'

  geolocation.enableLocationRequest().then(() => {
    geolocation
      .getCurrentLocation({
        desiredAccuracy: CoreTypes.Accuracy.high,
        maximumAge: 5000,
        timeout: 20000,
      })
      .then(currentLocation => {
        console.log('My current latitude: ', currentLocation.latitude)
      })
  })
</script>

<page>
  <actionBar>
    <gridLayout
      columns="auto, *"
      rows="*"
      style="width: 100%;"
      horizontalAlignment="left"
    >
      <label text={icons.menu} row="0" col="0" class="icon"></label>
      <textField
        hint="Search"
        row="0"
        col="1"
        class="text-lg bg-white px-2 italic"
      ></textField>
    </gridLayout>
  </actionBar>

  <gridLayout rows="auto, *, auto">
    <Feed />
  </gridLayout>
</page>

<style>
  actionBar {
    background-color: black;
    color: white;
  }
  actionBar label {
    color: white;
  }
</style>
