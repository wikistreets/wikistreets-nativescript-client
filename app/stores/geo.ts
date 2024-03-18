import { writable, readable, derived, get, Readable } from 'svelte/store'
import { CoreTypes, EventData, confirm, ConfirmOptions, alert, AlertOptions } from '@nativescript/core'
import { geocodeAddress, geocodeLocation } from '~/services/geocodeService'
import { GeoService } from '~/services/geoService'
import { DefaultLatLonKeys} from '@nativescript-community/gps'
import { Dialogs } from '@nativescript/core'

const defaults: DefaultLatLonKeys = { latitude: null, longitude: null, altitude: null }

export const geoIsEnabled = writable(true) // store to hold the status of GPS... assume true

let gs: GeoService // will hold geoService instance

/**
 * A Svelte store to hold geolocation data.
 */
export const geo = writable(defaults, () => {
    // this method runs on first subscriber
    console.log('geo: we have a subscriber!')

    // set up callbacks to update store when location changes
    gs = new GeoService(onEnableLocation, onStatusChange, onWatchEvent, onError) // instantiate the geoservice to start tracking location
    gs.enableLocation() // authorize location tracking

    // return method to run when no more subscribers
    return () => {
        console.log('geo: no more subscribers!')
    }
})

/**
 * A Svelte store to hold address data as type geocodeService/geocodeLocation
 */
export const addressData: Readable<geocodeLocation> = derived(geo, ($geo, set) => {
    geocodeAddress({ latitude: $geo.latitude, longitude: $geo.longitude })
    .then((result) => {
        if (result && ('sys' in result)) {
            set(result)
        }
    })
})

/**
 * Method to pop up dialog asking the user to modify Location settings.
 */
export const solicitConsent = async () => {
    console.log(`geo: solicitConsent: enabled: ${get(geoIsEnabled)}`)
    Dialogs.confirm({
        title: 'GPS Location disabled',
        message: `Please turn Location sharing in your device's settings.`,
        okButtonText: 'Go to Settings',
        cancelButtonText: 'Not now'
    } as ConfirmOptions)
    .then((consented: boolean) => {
        if (consented) gs.openGPSSettings();
    })
}

/**
 * Callback when location is successfully enabled
 */
const onEnableLocation = async () => {
    console.log(`geo: onEnableLocation: gs.isEnabled: ${gs.isEnabled}`)
    const location = await gs.getLocation()
    console.log(`geo: onEnableLocation: location: ${JSON.stringify(location)}`)
}

/**
 * Callback when the status of GPS changes on the device
 * @param e Data about the change in GPS status
 */
const onStatusChange = (e: any) => {
    const enabled = (e.object?.enabled === true && e.data?.enabled === true)
    // console.log(`geo: onStatusChange: enabled: ${enabled}, computed from data ${JSON.stringify(e)}`)
    geoIsEnabled.set(enabled) // store the result of the GPS status update
}

/**
 * Callback for changes in location
 * @param e Location data
 */
const onWatchEvent = (location: any) => {
    // console.log(`geo: onWatchEvent: ${JSON.stringify(location)}`)
    geo.set({
        latitude: location.lat,
        longitude: location.lng,
        altitude: location.alt,
    })
}

const onError = (type: string, e: any) => {
    console.log(`geo: onError: ${type}: ${JSON.stringify(e)}`)
}

