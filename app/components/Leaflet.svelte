<script lang="ts">
  import { Frame, Page, Observable, knownFolders } from '@nativescript/core'
  const webViewInterfaceModule = require('nativescript-webview-interface')
  // get html file
  const appPath = knownFolders.currentApp().path
  const html = appPath + '/assets/leaflet.html'

  // props
  export let row: number // if within a gridLayout
  export let pageRef: Page

  // webview interface
  $: webView = pageRef ? pageRef.getViewById('webview') : null
  $: oWebViewInterface = webView
    ? (() => {
        const obj = new webViewInterfaceModule.WebViewInterface(
          webView,
          '~/assets/leaflet.html',
        )
        console.log(`Webview interface object: ${obj}`)
        return obj
      })()
    : null
</script>

<webView id="webview" src={html} class="h-dvh w-dvw" {row} />