/**
 * Svelte store for keeping track of user's geolocation globally across app.
 */

import {
  GPS,
  DefaultLatLonKeys,
  setGeoLocationKeys,
} from '@nativescript-community/gps'
import { CoreTypes } from '@nativescript/core'
import { writable } from 'svelte/store'

export type GPSSettings = {
  desiredAccuracy: number
  updateDistance: number
  maximumAge: number
  timeout: number
}

const DEFAULT_LOCATION_SETTINGS: GPSSettings = {
  desiredAccuracy: CoreTypes.Accuracy.high,
  updateDistance: 10,
  maximumAge: 20000,
  timeout: 20000,
}

const DEFAULT_LNGLAT: DefaultLatLonKeys = { longitude: 41.1947, latitude: -73.87649 }

const createGeo = (lngLat: DefaultLatLonKeys = DEFAULT_LNGLAT) => {
  const { subscribe, set, update } = writable(lngLat, () => {
    return () => {
      console.log('Geo store is being destroyed')
    }
  }

  const gps = new GPS()
  setGeoLocationKeys('lat', 'lng', 'alt')

  function ping(settings: GPSSettings = DEFAULT_LOCATION_SETTINGS) {
    const geo = await gps.getCurrentLocation(settings)
    update(() => {
      const { longitude, latitude, altitude } = geo
      return { longitude, latitude, altitude }
    })
  }

  return {
    subscribe,
    ping,
  }
}

// singleton
export const geo = createGeo()
