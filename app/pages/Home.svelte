<script lang="ts">
  import * as geolocation from '@nativescript/geolocation'
  import { CoreTypes } from '@nativescript/core' // for high accuracy gps
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
  <tabView>
    <tabViewItem title="Account">
      <label textWrap="true"
        >This tab will list active tasks and will let users add new tasks.</label
      >
    </tabViewItem>
    <tabViewItem title="Feed">
      <Feed />
    </tabViewItem>
  </tabView>
</page>

<style>
</style>
