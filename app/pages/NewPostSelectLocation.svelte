<!-- @component Register form for new users. -->

<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { navigate, closeModal, goBack } from 'svelte-native'
import { Dialogs, EventData, Frame, Image, ImageAsset, Page, TextField, Utils } from '@nativescript/core'
import { requestPermissions as requestCameraPermissions, isAvailable as isCameraAvailable } from '@nativescript/camera';
import * as camera from "@nativescript/camera";
// import { PreviousNextView } from '@nativescript/iqkeyboardmanager'
import { Feature, FeatureCollection as Collection } from '@turf/turf'
import { user, token } from '~/stores/auth'
import { addressData, geo, geoIsEnabled, solicitConsent as solicitGPSConsent } from '~/stores/geo'
import { config } from '~/config/config'
import { icons } from '~/utils/icons'
import { geocodeAddress, geocodeLocation } from '~/services/geocodeService';
import Login from '~/pages/Login.svelte'
import NewPostAddContent from '~/pages/NewPostAddContent.svelte';
import Leaflet from '~/components/Leaflet.svelte'
  import { PreviousNextView } from '@nativescript/iqkeyboardmanager'

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

let unsubscribers: any[] = [] // will store any svelte stores we subscribe to
let mapFeedback = ''

let page: Page

let streetAddress: string = `Use map to select a location`
let mapCenterPoint: Feature
let mapZoom: number = config?.map?.defaults?.homingZoom || 3
let useGPSAddress = true


onMount(() => {
    console.log(`NewPost: onMount`)

    // enable IQKeyboardManager for iOS
    if (__IOS__) iqKeyboard = IQKeyboardManager.sharedManager();

    if (!geoIsEnabled) {
        solicitGPSConsent().then((result) => {
            console.log(`NewPost: solicitConsent: ${result}`)
        })
    }
    // subscribe to the geo location store and save the method to unsubscribe later
    unsubscribers.push(geo.subscribe((value) => {
        // console.log(`NewPost: geo.subscribe: ${JSON.stringify(value)}`)
        // only auto-update the map centerpoint if the user wants to use GPS address
        if (useGPSAddress) {
            // set initial map center point to match user's current position
            mapCenterPoint = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: [value.longitude, value.latitude]
                }
            }        
            // console.log(`NewPost: onMount: mapCenterPoint: ${JSON.stringify(mapCenterPoint)}`)
        }
    }))
    
    unsubscribers.push(addressData.subscribe( (newData: geocodeLocation) => {
        // only auto-update the centerpoint if the user wants to use GPS address
        if (useGPSAddress) {
            // update address reactively
            const newAddress = buildAddress(newData)
            streetAddress = newAddress ? newAddress : streetAddress
        }
    }))

}) // onMount

onDestroy(() => {
    console.log(`NewPost: onDestroy`)
    // unsubscribe from any subscribed svelte stores
    unsubscribers.forEach((unsubscribe) => { unsubscribe() })
})

const onPageLoad = (e: EventData) => {
    console.log(`NewPost: onPageLoad`)
    page = e.object as Page // store reference to page
}

const onSubmit = () => {
    console.log(`NewPost: onSubmit`)
    navigate({
        page: NewPostAddContent,
        props: {
            streetAddress,
            mapCenterPoint,
            mapZoom
        }
    
    })
}

const onGPSIconTap = (e: EventData) => {
    useGPSAddress = true // use the GPS to fetch the address again
    console.log(`NewPost: onGPSIconTap: currentLocation: ${JSON.stringify($geo)}`)
    if (!$geoIsEnabled) {
      console.log(`Map: onGPSIconTap: no location data`)
      solicitGPSConsent()
      return
    }
    // center the map on the user's location
    mapCenterPoint = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [$geo.longitude, $geo.latitude]
      }
    }
    // zoom in
    mapZoom = config.map.defaults.homingZoom
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

const onMapDragStart = () => {
    // stop using GPS address so user can find address by panning map
    useGPSAddress = false
    console.log(`onMapDragStart: useGPSAddress: ${useGPSAddress}`)
}

const onLocationSelected = () => {
    console.log(`NewPost: onLocationSelected`)
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
</script>
    
<page {...$$restProps} actionBarHidden={false} on:loaded={onPageLoad} on:tap={clearClutter}>
    <actionItem ios.position='left' android.position='actionBar' text="Cancel" on:tap={goBack} />
    <actionBar title="Select Location" flat="true">
    <actionItem
        ios.position="right"
        android.position="actionBar"
        text="Next"
        on:tap={onSubmit}
    />
    </actionBar>

    <previousNextView>
        <gridLayout rows="*, 120" class="h-full w-full m-0 p-0">
            <contentView row="0">
            <frame id="content">
                <page actionBarHidden={true} >

                    <!-- BEGIN: leaflet map to pick location -->
                    <gridLayout rows="100, *, 60, *, 100" columns="100, *, 60, *, 100" backgroundColor="red" class="w-full h-full">
                        <Leaflet
                          id="map"
                          row="0"
                          col="0"
                          rowSpan="5"
                          colSpan="5"
                          class="h-full w-full z-1"
                          page={page}
                          htmlFilePath="~/assets/leaflet.html"
                          centerPoint={ mapCenterPoint }
                          zoom={ mapZoom }
                          panToMapTapPoint={false}
                          on:mapMove={onMapMove}
                          on:dragStart={onMapDragStart}
                        />
                        <label text="{icons['gps-dot']}" on:tap={onGPSIconTap} class="icon text-3xl text-center text-lg w-full text-slate-800" row="0" col="0" />
                        <label text="{icons['gps']}" on:tap={onGPSIconTap} class="icon text-6xl text-center w-full text-red-800" row="2" col="2" />
                      </gridLayout>                
                <!-- END: leaflet map to pick location -->

                </page>
            </frame>
          </contentView>
          <contentView row="1">
            <frame id="addMediaButtons">
                <page actionBarHidden={true}>
                    <gridLayout row={0} rows="auto, 70" class="w-full h-full p-2 pb-4 m-2 text-center">
                        <label row={0} class="text-center text-sm p-0 m-0 text-slate-600 dark:text-slate-400" text="Post location" />
                        <label row={1} bind:text="{streetAddress}" class="text-lg" lineHeight={0} />
                    </gridLayout>
                </page>
            </frame>
          </contentView>  
    </gridLayout>
</previousNextView>

</page>
