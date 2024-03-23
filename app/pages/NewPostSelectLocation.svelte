<!-- @component Register form for new users. -->

<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { navigate, closeModal, goBack } from 'svelte-native'
import { Dialogs, EventData, Frame, Image, ImageAsset, Page, SwipeDirection, SwipeGestureEventData, TextField, Utils } from '@nativescript/core'
import * as camera from "@nativescript/camera";
// import { PreviousNextView } from '@nativescript/iqkeyboardmanager'
import { l, lc, lt } from '~/services/localeService'
import { Feature } from '~/models/feature'
import { user, token } from '~/stores/auth'
import { addressData, geo, geoIsEnabled, solicitConsent as solicitGPSConsent } from '~/stores/geo'
import { config } from '~/config/config'
import { icons } from '~/utils/icons'
import { geocodeAddress, geocodeLocation } from '~/services/geocodeService';
import NewPostAddContent from '~/pages/NewPostAddContent.svelte';
import Leaflet from '~/components/Leaflet.svelte'

// set up IQKeyboardManager for iOS
//@ts-ignore
declare const IQKeyboardManager: any;
let iqKeyboard: any;
let iqKeyboardEnabled: boolean = true;
let iqKeyboardToolbarEnabled: boolean = true;
let keepKeyboardOpenOnTouchOutside: boolean = true;
let showHintInToolbar: boolean = true;
let keyboardAppearanceDark: boolean = false;
let toggleDoneButtonTextChanged: boolean = false;
let increaseKeyboardDistanceFromtextField: boolean = false;

let page: Page

let unsubscribers: any[] = [] // will store any svelte stores we subscribe to
let mapFeedback = ''

let streetAddress: string = `Use map to select a location`
let mapCenterPoint: Feature // centerpoint of map
let homePoint: Feature // user's geolocation
let isHomeVisible: boolean = false // whether to show the home marker
let mapAutoHoming: boolean = false // whether to center on the homePoint
let mapZoom: number = config.map.defaults.homingZoom
let geoUnsubscribe: any // will hold the method to unsubscribe from the geo store
let useGPSAddress = true

$: console.log(`Map: mapAutoHoming: ${mapAutoHoming}`)

onMount(() => {
    console.log(`NewPost: onMount`)

    // enable IQKeyboardManager for iOS
    if (__IOS__) iqKeyboard = IQKeyboardManager.sharedManager();

}) // onMount

onDestroy(() => {
    console.log(`NewPost: onDestroy`)
    // unsubscribe from any subscribed svelte stores
    unsubscribers.forEach((unsubscribe) => { unsubscribe() })
})

const onPageLoad = (e: EventData) => {
    console.log(`NewPost: onPageLoad`)
    page = e.object as Page // store reference to page

    // turn on gps tracking by default
    setTimeout(onGPSIconTap, 300) // delay to allow page to load
    
    unsubscribers.push(addressData.subscribe( (newData: geocodeLocation) => {
        // only auto-update the centerpoint if the user wants to use GPS address
        if (useGPSAddress) {
            // update address reactively
            const newAddress = buildAddress(newData)
            streetAddress = newAddress ? newAddress : streetAddress
        }
    }))

}

const onSubmit = () => {
    console.log(`NewPost: onSubmit`)
    navigate({
        page: NewPostAddContent,
        props: {
            streetAddress,
            mapCenterPoint,
            mapZoom
        },
        animated: true,
        transition: {
            name: 'fade', // curlUp (iOS only) | curlDown (iOS only) | explode | fade | flipRight | flipLeft | slideLeft | slideRight | slideTop | slideBottom
            duration: 300,
            curve: 'easeIn'
        }
    
    })
}

const stopGeoTracking = () => {
    // already tracking geolocation, so stop it
    console.log(`Map: unsubscribing from geo`)
    mapAutoHoming = false
    isHomeVisible = false
    geoUnsubscribe()
    geoUnsubscribe = null
}

const onGPSIconTap = (e?: EventData) => {
  // console.log(`Map: onGPSIconTap: currentLocation: ${JSON.stringify($geo)}`)
  if (geoUnsubscribe) {
    stopGeoTracking()
    return
  }

  // subscribe to the geo location store and save the method to unsubscribe later
  console.log('NewPost: onGPSIconTap: subscribing to geo')
  mapAutoHoming = true // center the map on the user's location
  isHomeVisible = true // show the home marker
  mapZoom = config.map.defaults.homingZoom // zoom in
  geoUnsubscribe = geo.subscribe((newGeo) => {
    console.log(`NewPost: geo update: ${JSON.stringify(newGeo)}`)
    // save user's current location
    homePoint = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [newGeo.longitude, newGeo.latitude]
      }
    }
    if (mapAutoHoming) mapCenterPoint = homePoint // center the map on the user's location, if desired
  }) // geo.subscribe
  unsubscribers.push(geoUnsubscribe) // save in subscription list for remove onDestroy

//   if (!$geoIsEnabled) {
//     console.log(`NewPost: onGPSIconTap: no location data`)
//     solicitGPSConsent()
//     return
//   }
}

const onMapMove = async (e: CustomEvent) => {
    // svelte-native nests data into two detail objects for some reason
    // console.log(`NewPost: onMapMove: ${JSON.stringify(e.detail.detail)}`)
    const { lat: newLat, lng: newLng } = e.detail.detail.center // deconstruct the new coords
    const newData = await geocodeAddress({ latitude: newLat, longitude: newLng })
    // update address reactively
    const newAddress = buildAddress(newData)
    streetAddress = newAddress ? newAddress : streetAddress
}

const onMapZoom = (e: CustomEvent) => {
    // stop using GPS address so user can find address by panning map
    useGPSAddress = false
    console.log(`onMapZoom: ${JSON.stringify(e)}`)
}

const onMapDragStart = () => {
    mapAutoHoming = false // stop auto-centering on user's current location
    // stop using GPS address so user can find address by panning map
    useGPSAddress = false
    console.log(`onMapDragStart: useGPSAddress: ${useGPSAddress}`)
}

const onLocationSelected = () => {
    console.log(`NewPost: onLocationSelected`)
}

const onGoBack = async () => {
    goBack()
}

const buildAddress = (addressData) => {
    let address: string = '' // will build address onto this
    if (!(addressData && 'sys' in addressData)) return // abort if no sys ddata
    const { housenumber, street, city, country } = addressData.sys // destructure data
    address += (housenumber != null) ? housenumber : ''
    address += (street != null) ? ` ${street}` : ''
    address += (address != null) ? '\n' : '' // separate with line break, if address not empty so far
    address += (city != null) ? city : ''
    address += (country != null) ? `, ${country}` : ''
    address = address.trim() // remove any leading/trailing whitespace
    address = address.replace(/(^,)|(,$)/g, '') // remove comma
    // address = (address != '') ? address : config.address.DEFAULT_ADDRESS // if still empty, use default
    return (address != '') ? address : null
}

const clearClutter = () => {
    // dismiss the keyboard
    Utils.dismissKeyboard()
    Utils.dismissSoftInput()
}

const onActionBarSwipe = (e: SwipeGestureEventData) => {
  switch (e.direction) {
    case SwipeDirection.left: // left
      onSubmit() // go forwards
      break
    case SwipeDirection.right: // right
    //   console.log('NewPost: right')
      onGoBack() // go backwards
      break
    case SwipeDirection.down: // down
      console.log('NewPost: down')
      break
    case SwipeDirection.up: // up
      console.log('NewPost: up')
      break
    default:
      console.log(`NewPost: ${e.direction}`)
  }
}
</script>
    
<page {...$$restProps} actionBarHidden={false} on:loaded={onPageLoad} on:tap={clearClutter}>
    <actionBar title="{lc('NewPostSelectLocation.title')}" flat="true" on:swipe={onActionBarSwipe}>
        {#if __ANDROID__}
        <navigationButton
            android.systemIcon="ic_menu_close_clear_cancel"
            text="{lc('common.buttons.cancel')}"
            on:tap={onGoBack}
        />
        {:else }
        <navigationButton visibility='collapsed' text="Cancel" on:tap={onGoBack} />
        <actionItem
            ios.position="left"
            android.position="actionBar"
            ios.systemIcon="24"
            android.systemIcon="ic_menu_close_clear_cancel"
            text="{lc('common.buttons.cancel')}"
            on:tap={onGoBack}
        />
        {/if}
        <actionItem
            ios.position="right"
            android.position="actionBar"
            text="{lc('common.buttons.next')}"
            on:tap={onSubmit}
        />
    </actionBar>

    <previousNextView>
        <gridLayout rows="*, 120" class="h-full w-full m-0 p-0">
            <contentView row="0">
            <frame id="content">
                <page actionBarHidden={true} >

                    <!-- BEGIN: leaflet map to pick location -->
                    <gridLayout rows="100, *, 55, *, 100" columns="100, *, 55, *, 100" backgroundColor="red" class="w-full h-full">
                        <Leaflet
                            id="map"
                            row="0"
                            col="0"
                            rowSpan="5"
                            colSpan="5"
                            class="h-full w-full z-1"
                            htmlFilePath="~/assets/leaflet.html"
                            bind:centerPoint={ mapCenterPoint }
                            bind:homePoint={ homePoint }
                            bind:isHomeVisible={ isHomeVisible }
                            bind:zoom={ mapZoom }
                            panToMapTapPoint={false}
                            on:mapMove={onMapMove}
                            on:mapZoom={onMapZoom}
                            on:dragStart={onMapDragStart}
                        />
                        <label text="{icons['gps-dot']}" on:tap={onGPSIconTap} class="icon text-4xl text-center w-full {geoUnsubscribe ? 'text-slate-800' : 'text-slate-400'}" row="0" col={0} />
                        <label text="{icons['gps']}" on:tap={onGPSIconTap} class="icon text-6xl text-center w-full text-red-800" row="2" col={2} />
                      </gridLayout>                
                <!-- END: leaflet map to pick location -->

                </page>
            </frame>
          </contentView>
          <contentView row="1">
            <frame id="addMediaButtons">
                <page actionBarHidden={true}>
                    <gridLayout row={0} rows="auto, 70" class="w-full h-full p-2 pb-4 m-2 text-center">
                        <label row={0} class="text-center text-sm p-0 m-0 text-slate-600 dark:text-slate-400" text="{lc('NewPostSelectLocation.postLocation')}" />
                        <label row={1} bind:text="{streetAddress}" class="text-lg" lineHeight={0} />
                    </gridLayout>
                </page>
            </frame>
          </contentView>  
    </gridLayout>
</previousNextView>

</page>
