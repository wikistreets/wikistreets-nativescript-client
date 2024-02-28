# Wikistreets Nativescript Client

Native mobile app developed with Nativescript, Svelte, and TailwindCSS.

## Installation

- create Apple Developer account at https://developer.apple.com/
- install [XCode](https://developer.apple.com/xcode/) and [Android Studio](https://developer.android.com/studio)
- set up environment according to [instructions](https://docs.nativescript.org/setup/)
- install nativescript: `npm install -g nativescript`
- install dependencies: `npm install`
- ensure that `tailwindcss` is at version 3.1.8, since later versions are [currently incompatible](https://github.com/NativeScript/tailwind/issues/187)
- run the app in debug mode in simulator: `ns debug ios` or `ns debug android`
- run the app without debugging in simulator: `ns run ios` or `ns run android`
- run the app on a physical device - [see details](https://docs.nativescript.org/guide/running#running-on-physical-devices)

## Debugging

If running on Android produces errors about `Duplicate class` in Kotlin, follow the solution mentioned [here](https://stackoverflow.com/a/77432977) and insert the following line into the `platforms/android/build.gradle` at the bottom of the `dependencies { ... }` code block:

```js
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

## Toolkit

Built with almost entirely open source platforms and tools, including but not limited to:

- [Nativescript](https://nativescript.org/) for cross-platform mobile development
- [Svelte](https://svelte.dev/) as the front-end framework
- [TailwindCSS](https://tailwindcss.com/) for styling
- Map data from [OpenStreetMap](https://www.openstreetmap.org/)
- Maps presented by [Leaflet](https://leafletjs.com/)
- [Visual Studio Code](https://code.visualstudio.com/) as the IDE

Icons:

- App icons generated by [IconKitchen](https://icon.kitchen/)
- Additional icons may be sourced from [SJJB SVG Map Icons](https://www.sjjb.co.uk/mapicons/) and/or [icons8](https://icons8.com/)
