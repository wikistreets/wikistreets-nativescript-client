import { writable, readable, derived } from 'svelte/store'
import { CoreTypes, EventData } from '@nativescript/core'
import { GeoService } from '~/services/geoService'
import { DefaultLatLonKeys} from '@nativescript-community/gps'

const defaults: DefaultLatLonKeys = { latitude: null, longitude: null, altitude: null }

/**
 * A Svelte store to hold geolocation data.
 */
export const geo = writable(defaults, () => {
    // this method runs on first subscriber
    console.log('geo: we have a subscriber!')

    // return method to run when no more subscribers
    return () => {
        console.log('geo: no more subscribers!')
    }
})

/**
 * Callback when the status of GPS changes on the device
 * @param e Data about the change in GPS status
 */
const onStatusChange = (e: EventData) => {
    console.log(`geo: onStatusChange: ${JSON.stringify(e)}`)
}

/**
 * Callback for changes in location
 * @param e Location data
 */
const onWatchEvent = (location: any) => {
    console.log(`geo: onWatchEvent: ${JSON.stringify(location)}`)
    geo.set({
        latitude: location.lat,
        longitude: location.lng,
        altitude: location.alt,
    })
}

// set up callbacks to update store when location changes
const gs = new GeoService(onStatusChange, onWatchEvent) // instantiate the geoservice to start tracking location
