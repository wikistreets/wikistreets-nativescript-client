/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first page.
*/

import { Utils, Device, Screen, Application, ApplicationSettings, ApplicationEventData, OrientationChangedEventData, SystemAppearanceChangedEventData } from '@nativescript/core'
import { svelteNativeNoFrame } from 'svelte-native'
import { install as installDrawer } from '@nativescript-community/ui-drawer'
import DrawerElement from '@nativescript-community/ui-drawer/svelte'
import { install as installBottomSheet } from '@nativescript-community/ui-persistent-bottomsheet'
import BottomSheetElement from '@nativescript-community/ui-persistent-bottomsheet/svelte'
import { registerElement, registerNativeViewElement } from 'svelte-native/dom';
import { isConnected } from '~/stores/network'

import App from '~/App.svelte'

try {

  // necessary ui-drawer setup: https://github.com/nativescript-community/ui-drawer
  installDrawer()
  DrawerElement.register()

  // necessary ui-drawer setup: https://github.com/nativescript-community/ui-persistent-bottomsheet
  installBottomSheet()
  BottomSheetElement.register()

  // pull to refresh
  registerNativeViewElement(
    'pullrefresh',
    () => require('@nativescript-community/ui-pulltorefresh').PullToRefresh
  )

  // dump any device info to the console for debugging
  console.log(`Device:`)
  console.log(`\t${Utils.isRealDevice() ? 'Physical device' : 'Emulator'}`)
  console.log(`\t${Device.manufacturer} ${Device.deviceType} - ${Device.model}, ${Device.os} ${Device.osVersion} with SDK v${Device.sdkVersion}`)
  console.log(`\tPlatform: ${__ANDROID__ ? 'Android' : 'iOS'}`) // or could check __IOS__ variable
  console.log(`\tLanguage: ${Device.language}`)
  console.log(`\tRegion: ${Device.region}`)
  console.log(`\tUUID: ${Device.uuid}`)
  
  // dump any screen info to the console for debugging
  console.log(`Screen:`)
  console.log(`\t${Screen.mainScreen.widthDIPs} x ${Screen.mainScreen.heightDIPs} @ ${Screen.mainScreen.scale}x`)
  
  // dump any data stored in device's application settings to the console for debugging
  console.log(`Application:`)
  ApplicationSettings.getAllKeys().forEach(key => {
    try {
      const value = ApplicationSettings.getString(key) || ApplicationSettings.getNumber(key) || ApplicationSettings.getBoolean(key)
      console.log(`\t${key} -> ${value}`)
    }
    catch(error) {
      console.error(`Error reading key: ${key}`)
    }
  })

  // detect app launch
  Application.on(Application.launchEvent, () => {
    console.log(`App launched!`)
  })

  // detect orientation changes
  Application.on('orientationChanged', (e: OrientationChangedEventData) => {
    // handle the event
    console.log(`Orientation: ${e.newValue}`)
  })

  // detect dark/light mode changes
  Application.on('systemAppearanceChanged', (e: SystemAppearanceChangedEventData) => {
    console.log(`Theme: ${e.newValue}`)
  })

  // instantiate app
  svelteNativeNoFrame(App, {})

  // monitor network status
  isConnected.subscribe((isConnected: boolean) => {
    console.log(`Network: ${isConnected ? 'connected' : 'disconnected'}`)
  })

}
catch (error) {
    console.error(error, error.stack);
}
