/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first page.
*/

import { Application } from '@nativescript/core'
import { svelteNativeNoFrame } from 'svelte-native'
import { registerNativeViewElement } from 'svelte-native/dom'
import { install as installDrawer } from '@nativescript-community/ui-drawer'
import DrawerElement from '@nativescript-community/ui-drawer/svelte'
import { install as installBottomSheet } from '@nativescript-community/ui-persistent-bottomsheet'
import BottomSheetElement from '@nativescript-community/ui-persistent-bottomsheet/svelte'

import App from '~/App.svelte'

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

// theme helpers
Application.on(Application.launchEvent, () => {
  console.log(`Application launchEvent in app.ts`)
})

// instantiate app
svelteNativeNoFrame(App, {})
