import * as geolocation from '@nativescript/geolocation'
import { CoreTypes, ObservableArray, EventData } from '@nativescript/core' // for high accuracy gps
import {
  GPS,
  DefaultLatLonKeys,
  setGeoLocationKeys,
  Options as GPSOptions,
} from '@nativescript-community/gps'

export const DEFAULT_GEO_OPTIONS: GPSOptions = {
  desiredAccuracy: CoreTypes.Accuracy.high,
  updateDistance: 10,
  maximumAge: 20000,
  timeout: 20000,
}

const STARTING_GEO: DefaultLatLonKeys = { 
  longitude: 41.1947, 
  latitude: -73.87649,
  altitude: 0 
}

/**
 * Handles the dirty work of tracking the user's location and reporting changes to callback functions.
 * Wraps around geolocation plugin - https://docs.nativescript.org/plugins/geolocation#options-interface
 */
export class GeoService {
  private gps: GPS
  private watchId: number
  private minimumUpdateTime: number
  private gpsPoints: ObservableArray<any>
  private message: string

  /**
   * Constructor for the GeoService singleton
   * @param onStatusChange callback for when location status changes
   * @param onWatchEvent callback for when location is updated
   */
  constructor(onStatusChange: (e: EventData) => void, onWatchEvent?: Function, minimumUpdateTime: number = 1000) {
    this.gps = new GPS()
    this.minimumUpdateTime = minimumUpdateTime
    setGeoLocationKeys('lat', 'lng', 'alt')

    this.gpsPoints = new ObservableArray([]);

    onStatusChange = onStatusChange || this.handleStatusEvent;
    this.gps.on(GPS.gps_status_event, onStatusChange);

    this.enableLocation() // authorize location tracking
      .then(() => { this.watch(onWatchEvent) }) // set up location watcher with a callback
      .catch(this.error);
  }

  public enableLocation() {
    if (!this.gps.isEnabled()) {
        console.log('geoService: requesting location...');
        return this.gps.authorize(true).then(() => this.gps.enable())
    } else {
        console.log(`geoService: location already enabled.`)
        return Promise.resolve(true)
    }
  }

  public get isEnabled() {
    return this.gps.isEnabled()
  }

  public watch(callback: Function) {
    // watch for location changes and call the supplied callback when they occur
    console.log(`geoService: watch: minimumUpdateTimer: ${this.minimumUpdateTime}`);
    this.gps.watchLocation(callback.bind(this), this.error, {
        provider: 'gps',
        minimumUpdateTime: this.minimumUpdateTime
    }).then((watchId) => (this.watchId = watchId))
    .catch(this.error)
  }

  public clearWatch() {
    console.log('geoService: clearWatch');
    this.gps.clearWatch(this.watchId);
  }


  public getLocation(settings: any = DEFAULT_GEO_OPTIONS) {
    if (this.gps.isEnabled()) {
        return this.gps.getCurrentLocation(settings);
    }
    return Promise.reject('geoService: Geolocation not enabled.')
  }

  private handleStatusEvent(e: any) {
      console.log('geoService: gps_status_event:', e.data)
  }

  private locationReceived(position: any) {
    // {
    //   "latitude": 33.52077361638753,
    //   "longitude": -111.89930240833577,
    //   "altitude": 384.0000915527344,
    //   "horizontalAccuracy": 65,
    //   "verticalAccuracy": 10,
    //   "speed": -1,
    //   "direction": -1,
    //   "timestamp": "2016-10-04T00:22:59.316Z",
    //   "ios": {}
    // }

    console.log(`geoService: locationReceived: ${JSON.stringify(position)}`)

    const gpsTime: Date = new Date(position.timestamp);
    const logTime: Date = new Date();
    const difference: number = (logTime.getTime() - gpsTime.getTime()) / 1000;
    this.message = `last location:${difference},${position.latitude},${position.longitude}`;
    this.gpsPoints.unshift({ name: gpsTime });
  }  

  private error(e: any) {
    console.log('geService: error:', e);
  }

  private data() {
    return {
        watchId: null,
        message: 'Tracking location',
        gpsPoints: []
    };
  }

  private destroy() {
    if (this.watchId) {
      console.log('clearWatch');
      this.gps.clearWatch(this.watchId);
    }
  }

  private static formatDate(date: Date) {
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }


} // GeoService class
