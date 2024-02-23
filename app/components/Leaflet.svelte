<!-- @component Wrapper around a WebView that loads the HTML code for a Leaflet map. -->

<script lang="ts">
  import { Page, knownFolders } from '@nativescript/core'
  const webViewInterfaceModule = require('nativescript-webview-interface')

  // props
  let pageRef: Page
  export { pageRef as page }
  export let htmlFilePath: string

  // webview interface
  $: webView = pageRef ? pageRef.getViewById('webview') : null
  $: oWebViewInterface = webView
    ? (() => {
        // console.log(`webView set to: ${webView}`)
        const interfaceObj = new webViewInterfaceModule.WebViewInterface(
          webView,
          htmlFilePath,
        )
        // console.log(`webViewInterface set to: ${interfaceObj}`)

        interfaceObj.on('onload', () => {
          console.log('onLoad from outside webView!')
          interfaceObj.emit('messageToWebView', `foobarbazbum`) //!
        })

        interfaceObj.on('messageToNativeScript', (message: string) => {
          console.log(`messageToNativeScript: ${message}`)
        })

        return interfaceObj
      })()
    : null
</script>

<webView id="webview" src={htmlFilePath} {...$$restProps} />
