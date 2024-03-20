<!-- @component Top-most component that first loads. -->

<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { navigate } from 'svelte-native'
import { Frame, Page, EventData, View, Dialogs, ConfirmOptions } from '@nativescript/core'
import { GPS } from '@nativescript-community/gps'
import Map from './pages/Map.svelte'
import BottomNavigation from '~/components/BottomNavigation.svelte'

let page: Page
let bottomNav: Page

onMount(() => {
  console.log(`App: onMount`)
})
onDestroy(() => {
  console.log(`App: onDestroy`)
})
const onPageLoad = (e: EventData) => {
  console.log(`App: onPageLoad`)
  page = e.object as Page
  bottomNav = page.getViewById('bottomNav') as Page

  // trigger dialog to ask user to change Location settings
  // setTimeout(() =>{
  //   // wait a second, then try again
  //   if (!$geoIsEnabled) {
  //     solicitGPSConsent()
  //   }
  // }, 2000)

}
</script>

<frame id="topmost">
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