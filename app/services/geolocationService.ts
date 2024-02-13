import * as geolocation from '@nativescript/geolocation'
import { CoreTypes } from '@nativescript/core' // for high accuracy gps

export class GeolocationService {
  // default settings
  private static DEFAULT_LOCATION_SETTINGS = {
    desiredAccuracy: CoreTypes.Accuracy.high,
    updateDistance: 10,
    maximumAge: 20000,
    timeout: 20000,
  }
  static getCurrentLocation(settings?: any): Promise<geolocation.Location> {
    /**
     * Returns current geolocation
     */
    settings = settings
      ? settings
      : GeolocationService.DEFAULT_LOCATION_SETTINGS
    return geolocation.getCurrentLocation(settings).then(geoLoc => {
      return geoLoc // contains latitude, longitude
    })
  }
}
