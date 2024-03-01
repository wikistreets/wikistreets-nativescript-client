<!-- @component Wrapper around a WebView that loads the HTML code for a Leaflet map. Emits markerTap event to parent component -->

<script lang="ts">
  import { Screen, Page, EventData, WebView, ViewBase, knownFolders } from '@nativescript/core'
  import { onMount, createEventDispatcher } from 'svelte'
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
  // export let onMarkerTap: (postId: number) => void // when user taps a marker on the map

  let isWebViewLoaded: boolean = false
  let webViewInterface: any // for passing messages to/from webview
  const dispatch = createEventDispatcher(); // for emitting messages to parent component

  // get handle on webview interface once page has loaded
  let webView = null
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
          // once the webview has fully loaded, we can pass it data
          isWebViewLoaded = true
          // webViewInterface.emit('messageToWebView', `foobarbazbum`) //!
        })

        webViewInterface.on('messageToNativeScript', (message: string) => {
          console.log(`From webView: ${message}`)
        })

        webViewInterface.on('onMarkerTap', (postId: number) =>  {       
          // console.log(`Leaflet.svelte: onMarkerTap postId ${postId}`)
          dispatch('markerTap', { postId })
        })

        return webViewInterface
      })()
    : null

  // wait for posts to be passed and then pass them to webview to place on map
  $: (isWebViewLoaded) ? (() => {
      console.log(`Passing ${posts.length} posts to webView.`)
      posts.forEach((post) => {
        webViewInterface.emit('makeMarker', post)
      })

    })() : null


    const onLongPress = (e: EventData) => {
      console.log(`long press!`)
      webViewInterface.emit('clearSelection')

    }

    onMount(() => {
      // posts are not yet available onMount
      console.log(`Leaflet mounted with ${posts.length} posts.`)
    })
</script>

<absoluteLayout backgroundColor="red"  {...$$restProps} on:longPress={onLongPress} >
  <label top="10" left={centerX} backgroundColor="blue" text="Leaflet" class="bg-red-800 text-lg text-center m-0 p-4 z-10" />
  <webView bind:this={webView} class="w-full h-full z-0" id="webview" src={htmlFilePath} />
</absoluteLayout>
