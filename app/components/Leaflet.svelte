<script lang="ts">
  import { Frame, Page, Observable, knownFolders } from '@nativescript/core'
  const webViewInterfaceModule = require('nativescript-webview-interface')

  // get html file
  // const appPath = knownFolders.currentApp().path
  // const htmlFilePath = appPath + '/assets/leaflet.html'
  const htmlFilePath = '~/assets/leaflet.html'

  // props
  export let row: number // if within a gridLayout
  let pageRef: Page
  export { pageRef as page }

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

<webView id="webview" src={htmlFilePath} class="h-dvh w-dvw" {row} />
