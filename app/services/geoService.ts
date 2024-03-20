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
  timeout: 2000,
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

  private onEnable: () => void
  private onStatusChange: (e: EventData) => void
  private onWatchEvent: (location: any) => void

  /**
   * Constructor for the GeoService singleton
   * @param onStatusChange callback for when location status changes
   * @param onWatchEvent callback for when location is updated
   */
  constructor(onEnable?: () => void, onStatusChange?: (e: EventData) => void, onWatchEvent?: (location: any) => void, onError?: (type: string, e: any) => void, minimumUpdateTime: number = 1000) {
    this.gps = new GPS()
    this.minimumUpdateTime = minimumUpdateTime
    setGeoLocationKeys('lat', 'lng', 'alt')

    this.gpsPoints = new ObservableArray([]);
    
    this.onEnable = onEnable || (() => console.log('geoService: location enabled')) // default enable location handler
    this.onStatusChange = onStatusChange || this.handleStatusEvent; // defauld status change handler
    this.onWatchEvent = onWatchEvent // default location update handler
    this.error = onError || this.error; // default error handler
    this.gps.on(GPS.gps_status_event, onStatusChange);
  }

  public enableLocation() {
    if (!this.gps.isEnabled()) {
        console.log('geoService: requesting location...');
        try {
          return this.gps.authorize(true).then(
            () => this.gps.enable()
          )
          .then(() => { 
            console.log('geoService: location enabled.')
            // start watching
            this.watch(this.onWatchEvent) // start tracking changes
            this.onEnable() // custom callback to run after attempt is made to enable location services
          }) // set up location watcher with a callback
          .catch(err => {
            this.error('enableLocation', err) // report error
          })    
          .catch(err => {
            this.error('authorize', err)
            return Promise.reject(err)          
          })
        }
        catch (err) {
          this.error('authorize', err)
          return Promise.reject(err)
        }
    } else {
        console.log(`geoService: location already enabled.`)
        // start watching
        this.watch(this.onWatchEvent) // start tracking changes
        this.onEnable() // custom callback to run after attempt is made to enable location services
        return Promise.resolve(true)
    }
  }

  public get isEnabled() {
    return this.gps.isEnabled()
  }

  /**
   * Wrapper around the geolocation plugin's openGPSSettings method for Android devices
   */
  public async openGPSSettings() {
    try {
      return await this.gps.openGPSSettings()    
    }
    catch (err) {
      this.error('openGPSSettings', err)
      return Promise.reject(err)
    }
  }

  public watch(callback: Function) {
    // watch for location changes and call the supplied callback when they occur
    console.log(`geoService: watch: minimumUpdateTimer: ${this.minimumUpdateTime}`);
    try {
      this.gps.watchLocation(
        callback.bind(this), // make sure `this` in the callback refers to the GeoService instance
        err => { this.error('watch', err) }, // error callback
        {
          // watch GPS options
          provider: 'gps',
          minimumUpdateTime: this.minimumUpdateTime
        })
        .then((watchId) => (this.watchId = watchId))
        .catch(err => this.error('watch', err))
    }
    catch (err) {
      this.error('watch', err)
    }
  }

  public clearWatch() {
    try {
      this.gps.clearWatch(this.watchId);
      console.log('clearWatch: done');
    }
    catch (err) {
      this.error('clearWatch', err);
    }
  }


  public getLocation(settings: GPSOptions = DEFAULT_GEO_OPTIONS) {
    if (this.gps.isEnabled()) {
      try {
        return this.gps.getCurrentLocation(settings);
      }
      catch (err) {
        this.error('getLocation', err);
        return Promise.reject(err);
      }
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

  private error(type: string, e: any) {
    if (typeof e === 'object') e = JSON.stringify(e);
    console.log(`geoService: error: ${type}: ${e}`);
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
      this.clearWatch()
    }
  }

  private static formatDate(date: Date) {
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }


} // GeoService class
