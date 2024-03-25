# Wikistreets Nativescript Client

Native mobile app developed with Nativescript, Svelte, and TailwindCSS.

## Projects that make this possible

### OpenStreetMap data
This app depends upon [OpenStreetMap](https://openstreetmap.org) (OSM) data, &copy; OpenStreetMap contibutors, and made available for use under the [Open Database License](https://openstreetmap.org/copyright).  If you notice any map data that should be updated or corrected, consider [fixing it yourself](https://www.openstreetmap.org/fixthemap) or reporting the issue.

### OpenStreetMap map tiles
By default, we also use the OSM tile server, in accordance with their [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/).  This tile server is entirely supported by donations and not meant to be used heavily by apps.  Consider donating to OSM to support their mission to make map data and map image tiles freely available to the world.  Should our app become so popular that we exceed their very reasonable tile usage limits, we have provided an in-app account setting that allows users to switch to a different tile server.

### Alternate tile servers
OpenStreetMap maintains a list of [raster](https://wiki.openstreetmap.org/wiki/Raster_tile_providers) and [vector](https://wiki.openstreetmap.org/wiki/Vector_tiles#Providers) tile providers that can be used within the app in place of the default OSM standard tile server.


## Installation

- create Apple Developer account at https://developer.apple.com/
- install [XCode](https://developer.apple.com/xcode/) and [Android Studio](https://developer.android.com/studio)
- set up environment according to [instructions](https://docs.nativescript.org/setup/)
- install nativescript: `npm install -g nativescript`
- install dependencies: `npm install`
- ensure that `tailwindcss` is at version `3.1.8`, since later versions are [currently incompatible](https://github.com/NativeScript/tailwind/issues/187)
- create an `.env` file based on the [env.example](./env.example) with correct values for each variable
- run the app in debug mode in simulator: `ns debug ios` or `ns debug android`
- run the app without debugging in simulator: `ns run ios` or `ns run android`
- run the app on a physical device - [see details](https://docs.nativescript.org/guide/running#running-on-physical-devices)

### Camera permissions
The app uses the [camera](https://docs.nativescript.org/plugins/camera) plugin - follow the setup instructions there to grant permissions to the camera on both Android and iOS.

### GPS permissions
It may be necessary to grant permission to use the device's GPS.  I haven't thoroughly tested this yet.

## Testing

The project is set up to run unit tests using [jasmine](https://jasmine.github.io/).  Tests should be placed in the `app`/`tests` directory.  Run them with `ns test ios` or `ns test android`.  Optional flags include `--emulator` to launch the tests within the device emulator, `--justlaunch` to quit the emulator once tests are complete, and `--watch` to re-launch the tests automatically upon code change.

## Troubleshooting

### Hot Module Reloading (HMR)
If running on iOS shows error messages mentioning `hmr`, try running without that, e.g. `ns debug ios --no-hmr`.  This isn't a solution, since HMR should work, but could avoid the problem.

### Android
If running on Android produces errors about `Duplicate class` in Kotlin, follow the solution mentioned [here](https://stackoverflow.com/a/77432977) and insert the following line into the `platforms/android/app/build.gradle` at the bottom of the `dependencies { ... }` code block:

```js
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

## Documentation

Nativescript and Svelte Native are woefully underdocumented.  However, here are a few useful links:
- [My own notes](./notes.md) on using Svelte and Nativescript.
- [Nativescript v7 documentation](https://v7.docs.nativescript.org/), while out of date, contains the most thorough documentation of the basic concepts of Nativescript development.
- [Nativescript v8 documentation](https://docs.nativescript.org/), while useful and up to date, does a poor job explaining some fundamental concepts.
- [Svelte Native documentation](https://svelte-native.technology/) provides some simple notes about getting started with Svelte and Nativescript.
- [Svelte documentation](https://svelte.dev/), while focused on web apps, is useful in understanding Svelte props, stores, and other core features.
- [Nativescript Community Plugins](https://github.com/nativescript-community) - extensions that provide common functionality.
- [iOS system icons](https://developer.apple.com/documentation/uikit/uibarbuttonitem/systemitem) - their integer values can be used in `actionItem` components with the `ios.systemIcon` attribute.
- [Android system icons](https://developer.android.com/reference/android/R.drawable) - the names can be used in `actionItem` components with the `android.systemIcon` attribute.

## Toolkit

Built with almost entirely open source platforms and tools, including but not limited to:

- [Nativescript](https://nativescript.org/) for cross-platform mobile development
- [Svelte](https://svelte.dev/) as the front-end framework
- [TailwindCSS](https://tailwindcss.com/) for styling
- Map data from [OpenStreetMap](https://www.openstreetmap.org/)
- Maps presented by [Leaflet](https://leafletjs.com/)
- [Visual Studio Code](https://code.visualstudio.com/) as the IDE

Icons:

- App widget icons generated by [IconKitchen](https://icon.kitchen/)
- Navigation icons by [Material Design Iconic Font](https://zavoloklom.github.io/material-design-iconic-font/)
- Additional icons may be sourced from [SJJB SVG Map Icons](https://www.sjjb.co.uk/mapicons/) and/or [icons8](https://icons8.com/)


## Useful reading/watching
Svelte
- [6 Ways to Do Component Communications in Svelte](https://betterprogramming.pub/6-ways-to-do-component-communications-in-svelte-b3f2a483913c)
- [How Svelte Stores Make State Management Easy](https://www.youtube.com/watch?v=L3uBfL-4dDM)

Leaflet
- [Using SVG icons for Leaflet js markers](https://onestepcode.com/leaflet-markers-svg-icons/)

Nativescript
- CollectionView: [yarn documentation](https://yarnpkg.com/package?q=%40nativescript-community%2Fui-collectionview&name=%40nativescript-community%2Fui-collectionview) and [Harness the power of CollectionView](https://blog.nativescript.org/collectionview-power/)
- [Filterable List Picker in NativeScript](https://blog.nativescript.org/filterable-list-picker-in-nativescript/)
- [Animated Bottom Sheet in NativeScript Tutorial](https://www.youtube.com/watch?v=SeTol800wFQ&list=PLPwbI_iIX3aS0_AcjiIEgVoEEEUhk0Bs5&index=87)

