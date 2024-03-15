<!-- @component Wrapper around a WebView that loads the HTML code for a Leaflet map. Emits markerTap event to parent component -->

<script lang="ts">
import { Screen, Page, EventData, WebView, ViewBase, knownFolders, SwipeGestureEventData, SwipeDirection } from '@nativescript/core'
import { onMount, createEventDispatcher } from 'svelte'
import { NativeElementNode, NativeViewElementNode } from 'svelte-native/dom'
import { Feature, center, geojsonType} from '@turf/turf'
const webViewInterfaceModule = require('nativescript-webview-interface')

// for positioning elements
let screenHeight: number = Screen.mainScreen.heightDIPs
let screenWidth: number = Screen.mainScreen.widthDIPs
$: centerX = screenWidth / 2
$: centerY = screenHeight / 2

// props
export let htmlFilePath: string
export let posts: any[] = [] // will hold posts to put onto map
export let bbox: number[] = null // will hold the bounding box of the map
export let centerPoint: Feature // will hold the center of the map
export let zoom: number = 4 // initial zoom level
export let panToTappedMarker: boolean = false // whether to pan to a tapped marker
export let focusOnTappedMarker: boolean = true // whether to highlight a tapped marker
export let panToMapTapPoint: boolean = true // whether to pan to a tapped point on the map
// export let onMarkerTap: (postId: number) => void // when user taps a marker on the map

let isWebViewLoaded: boolean = false
let webViewInterface: any // for passing messages to/from webview
const dispatch = createEventDispatcher(); // for emitting custom messages to parent component

// get handle on webview interface once page has loaded
let webView = null
let map: any // will hold map passed to use from webView

$: if (isWebViewLoaded) webViewInterface.emit('panTo', centerPoint) // set map center on change

$: if (isWebViewLoaded && centerPoint && zoom) (() => {
  // set the view
  webViewInterface.emit('setView', {feature: centerPoint, zoom}) // set map center
})()

$: if (isWebViewLoaded && posts.length) (() => {
  // pass data to webview when webview communication is open and the posts prop has been received from parent
  console.log(`Leaflet: ready with ${posts.length} posts`)
  posts.forEach((post) => {
    webViewInterface.emit('makeMarker', post) // place markers on map
  })
})()


/**
 * Handle on:loaded event for the webView component
 * @param e
 */
const onWebViewLoaded = (e: EventData) => {
  console.log(`Leaflet: onWebViewLoaded`)
  webView = e.object as WebView

  // set up bi-directional communications with webView

  // console.log(`webView set to: ${webView}`)
  webViewInterface = new webViewInterfaceModule.WebViewInterface(
    webView,// .nativeElement, // must get native element
    htmlFilePath,
  )

  webViewInterface.on('onload', () => {
    // once the webview has fully loaded and sent us the 'onload' message, we can pass it data
    isWebViewLoaded = true
  })

  webViewInterface.on('mapClick', (e: any) => {
    // center map on clicked point
    if (!panToMapTapPoint) return // abort, if not desired
    // console.log(`Leaflet: mapClick: ${JSON.stringify(e)}!`)
    const geoJSONObj: Feature = {type: 'Feature', properties: { }, geometry: { type: 'Point', coordinates: [e.lng, e.lat] }}
    // console.log(`Centering on ${JSON.stringify(geoJSONObj, null, 2)}!`)
    // webViewInterface.emit('panTo', geoJSONObj)
    centerPoint = geoJSONObj
    dispatch('mapTap', {centerPoint}) // let parent know where tap happened
  })

  webViewInterface.on('mapZoom', (zoomLevel: number) => {
    dispatch('mapZoom', zoomLevel)
    zoom = zoomLevel
  })

  webViewInterface.on('mapMove', (e: any) => {
    dispatch('mapMove', e)
  })

  webViewInterface.on('dragstart', (e: any) => {
    dispatch('dragStart', e)
  })

  // receive debubbing messages from webView
  webViewInterface.on('debug', (message: string) => {
    console.log(`webView debug: ${message}`)
  })

  webViewInterface.on('onMarkerTap', (postId: number) =>  { 
    if (!postId) return
    console.log(`Leaflet: onMarkerTap: postId ${postId}`)
    dispatch('markerTap', { postId })
    const geoJSONObj = posts.find((p) => p._id === postId) // the post whose marker was tapped
    if (panToTappedMarker) {
      // center map on tapped marker
      // console.log(`Centering on ${JSON.stringify(geoJSONObj, null, 2)}!`)
      webViewInterface.emit('panTo', geoJSONObj)
      centerPoint = geoJSONObj
    }
    if (focusOnTappedMarker) {
      // highlight the tapped marker
      console.log(`Focusing on ${geoJSONObj._id}!`)
      webViewInterface.emit('focusMarker', geoJSONObj) // ask webview to highlight marker
    }
  })

  return webViewInterface

}

const onSwipe = (e: SwipeGestureEventData) => {
  switch (e.direction) {
    case SwipeDirection.left: // left
      console.log('onSwipe: left')
      break
    case SwipeDirection.right: // right
      console.log('onSwipe: right')
      break
    case SwipeDirection.up: // up
      console.log('onSwipe: up')
      break
    case SwipeDirection.down: // down
      console.log('onSwipe: down')
      break
    default:
      console.log(`onSwipe: ${e.direction}`)
  }
}

onMount(() => {
  // posts are not yet available onMount
  console.log(`Leaflet: onMount w/ ${posts.length} posts.`)
})
</script>

<webView id="webview" src={htmlFilePath} {...$$restProps} on:loaded={onWebViewLoaded} on:longPress on:swipe={onSwipe} />
