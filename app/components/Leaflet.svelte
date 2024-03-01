<!-- @component Wrapper around a WebView that loads the HTML code for a Leaflet map. -->

<script lang="ts">
  import { Screen, Page, EventData, knownFolders } from '@nativescript/core'
  import { onMount } from 'svelte'
  import { NativeElementNode, NativeViewElementNode } from 'svelte-native/dom'
  const webViewInterfaceModule = require('nativescript-webview-interface')
    
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
  export let onMarkerTap: (postId: number) => void // when user taps a marker on the map

  let interfaceObj: any
  let isWebViewLoaded: boolean = false

  // get handle on webview interface once page has loaded
  $: webView = pageRef ? pageRef.getViewById('webview') : null
  $: oWebViewInterface = webView
    ? (() => {
        // console.log(`webView set to: ${webView}`)
        interfaceObj = new webViewInterfaceModule.WebViewInterface(
          webView,
          htmlFilePath,
        )
        // console.log(`webViewInterface set to: ${interfaceObj}`)

        interfaceObj.on('onload', () => {
          console.log('Webview loaded')
          isWebViewLoaded = true
          interfaceObj.emit('messageToWebView', `foobarbazbum`) //!
        })

        interfaceObj.on('messageToNativeScript', (message: string) => {
          console.log(`From webView: ${message}`)
        })

        interfaceObj.on('onMarkerTap', (postId: number) => {
          console.log(`Marker ${postId} tapped`)
          onMarkerTap(postId)
        })

        return interfaceObj
      })()
    : null

  // wait for posts to be passed and then pass them to webview to place on map
  $: (isWebViewLoaded) ? (() => {
      console.log(`Passing ${posts.length} posts to webView.`)
      posts.forEach((post) => {
        interfaceObj.emit('makeMarker', post)
      })

    })() : null


    const onLongPress = (e: EventData) => {
      console.log(`long press!`)
      interfaceObj.emit('clearSelection')

    }

    onMount(() => {
      // posts are not yet available onMount
      console.log(`Leaflet mounted with ${posts.length} posts.`)
    })
</script>

<absoluteLayout backgroundColor="red"  {...$$restProps} on:longPress={onLongPress} >
  <label top="10" left={centerX} backgroundColor="blue" text="Leaflet" class="bg-red-800 text-lg text-center m-0 p-4 z-10" />
  <webView class="w-full h-full z-0" id="webview" src={htmlFilePath} />
</absoluteLayout>
