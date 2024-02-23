/**
 * Svelte store for keeping track of user's geolocation globally across app.
 */

import { derived, writable, Writable } from 'svelte/store'

export type LngLat = {
  lng: number
  lat: number
}

class GeoStore {
  constructor(
    public lngLat: Writable<LngLat> = writable({
      lng: 41.1947,
      lat: -73.87649,
    })
  ) {}

  get geoPosition() {
    // Use derived to access writable values and export as readonly
    return derived(this.lngLat, $lngLat => {
      return $lngLat
    })
  }
}

// Export a singleton
export const geoStore = new GeoStore()

// Allow for multiple stores (good for contexts)
// export const createGeoStore = () => new GeoStore();
