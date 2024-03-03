<!-- @component Wrapper around a WebView that loads the HTML code for a Leaflet map. Emits markerTap event to parent component -->

<script lang="ts">
  import { Screen, Page, EventData, WebView, ViewBase, knownFolders, SwipeGestureEventData } from '@nativescript/core'
  import { onMount, createEventDispatcher } from 'svelte'
  import { NativeElementNode, NativeViewElementNode } from 'svelte-native/dom'
  import { Feature, center} from '@turf/turf'
  const webViewInterfaceModule = require('nativescript-webview-interface')
  import Header from './Header.svelte'
    
  // for positioning elements
  let screenHeight: number = Screen.mainScreen.heightDIPs
  let screenWidth: number = Screen.mainScreen.widthDIPs
  $: centerX = screenWidth / 2
  $: centerY = screenHeight / 2

  // props
  let pageRef: Page
  export { pageRef as page }
  export let htmlFilePath: string
  export let posts: any[] = [] // will hold posts to put onto map
  export let bbox: number[] // will hold the bounding box of the map
  export let centerPoint: any // will hold the center of the map
  export let panToTappedMarker: boolean = false // whether to pan to a tapped marker
  export let panToMapTapPoint: boolean = true // whether to pan to a tapped point on the map
  // export let onMarkerTap: (postId: number) => void // when user taps a marker on the map

  let isWebViewLoaded: boolean = false
  let webViewInterface: any // for passing messages to/from webview
  const dispatch = createEventDispatcher(); // for emitting messages to parent component

  // get handle on webview interface once page has loaded
  let webView = null
  let map: any // will hold map passed to use from webView

  const onSwipe = (e: SwipeGestureEventData) => {
    switch (e.direction) {
      case 1: // left
        console.log('swipe left')
        break
      case 2: // right
        console.log('swipe right')
        break
      case 3: // not up, but should be!
      case 8: // up
        console.log('swipe up')
        break
      case 4: // down
        console.log('swipe down')
        break
      default:
        console.log(`unknown swipe direction: ${e.direction}`)
    }
  }
  
  // $: webView = pageRef ? pageRef.getViewById('webview') : null
  $: webView
    ? (() => {
      // set up bi-directional webview message passing

        // console.log(`webView set to: ${webView}`)
        webViewInterface = new webViewInterfaceModule.WebViewInterface(
          webView.nativeElement, // must get native element
          htmlFilePath,
        )
        // console.log(`webViewInterface set to: ${webViewInterface}`)

        webViewInterface.on('onload', () => {
          // once the webview has fully loaded and sent us the 'onload' message, we can pass it data
          isWebViewLoaded = true
          console.log(`Leaflet.svelte: webView loaded.`)
          // webViewInterface.emit('messageToWebView', `foobarbazbum`) //!
          // adjust viewport of the map to fit the markers
          // console.log(`Leaflet.svelte: bbox -> ${bbox}, center -> ${JSON.stringify(center, null, 2)}`)
          // if (bbox.length) webViewInterface.emit('setBounds', bbox) // set map bbox
          // console.log(`Leaflet.svelte: center -> ${JSON.stringify(center, null, 2)}`)
          console.log(`Centering on center: ${centerPoint}`)
          if (centerPoint) webViewInterface.emit('setCenter', centerPoint) // set map center
        })

        webViewInterface.on('mapClick', (e: any) => {
          // center map on clicked point
          if (!panToMapTapPoint) return // abort, if not desired
          const geoJSONObj: Feature = {type: 'Feature', properties: { }, geometry: { type: 'Point', coordinates: [e.lng, e.lat] }}
          console.log(`Centering on ${JSON.stringify(geoJSONObj, null, 2)}!`)
          webViewInterface.emit('panTo', geoJSONObj)
          centerPoint = geoJSONObj
         })

        webViewInterface.on('messageToNativeScript', (message: string) => {
          console.log(`From webView: ${message}`)
        })

        webViewInterface.on('onMarkerTap', (postId: number) =>  {       
          // console.log(`Leaflet.svelte: onMarkerTap postId ${postId}`)
          dispatch('markerTap', { postId })
          // center map on tapped marker
          if (!panToTappedMarker) return // abort, if not desired
          const geoJSONObj = posts.find((p) => p.id === postId)
          console.log(`Centering on ${JSON.stringify(geoJSONObj, null, 2)}!`)
          webViewInterface.emit('panTo', geoJSONObj)
          centerPoint = geoJSONObj
        })

        return webViewInterface
      })()
    : null

  // wait for posts to be passed and then pass them to webview to place on map
  $: (isWebViewLoaded) ? (() => {
      console.log(`Passing ${posts.length} posts to webView.`)
      posts.forEach((post) => {
        webViewInterface.emit('makeMarker', post) // place markers on map
      })
    })() : null // isWebViewLoaded

    // const onLongPress = (e: EventData) => {
    //   console.log(`long press!`)
    //   webViewInterface.emit('clearSelection')

    // }

    onMount(() => {
      // posts are not yet available onMount
      console.log(`Leaflet mounted with ${posts.length} posts.`)
    })
</script>

<webView bind:this={webView} id="webview" src={htmlFilePath} {...$$restProps} on:longPress on:swipe={onSwipe} />
