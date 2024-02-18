import * as geolocation from '@nativescript/geolocation'
import { CoreTypes } from '@nativescript/core' // for high accuracy gps

export class GeolocationService {
  // default settings
  static DEFAULT_LOCATION_SETTINGS = {
    desiredAccuracy: CoreTypes.Accuracy.high,
    updateDistance: 10,
    maximumAge: 20000,
    timeout: 20000,
  }

  static async getCurrentLocation(
    settings?: any
  ): Promise<geolocation.Location> {
    /**
     * Returns current geolocation
     */
    settings = settings
      ? settings
      : GeolocationService.DEFAULT_LOCATION_SETTINGS
    const geoLoc = await geolocation.getCurrentLocation(settings) // contains latitude, longitude
    return geoLoc
  }
}
