<!-- @component Register form for new users. -->

<script lang="ts">
    import { navigate, closeModal } from 'svelte-native'
    import { Image, TextField } from '@nativescript/core'
    import { NativeViewElementNode } from 'svelte-native/dom';
    import { requestPermissions } from '@nativescript/camera';
    import * as camera from "@nativescript/camera";
    import { user, token } from '~/stores/auth'
    import { config } from '~/config/config'
    import Login from '~/pages/Login.svelte'
    import { onMount } from 'svelte'
    import { icons } from '~/utils/icons'
  
    let title: string
    let body: string
    let image: Image
    let imageRef: NativeViewElementNode<Image>
    $: imageRef = image ? image.nativeView : null // update the native element corresponding to the image
  
    let cameraLabelVisibility: string = 'visible' // 'visible' | 'hidden' | 'collapsed'
    let error: string

    const cameraOptions = {
        width: 300,
        height: 300,
        keepAspectRatio: true,
        saveToGallery: true
    };
  
    export let onComplete: Function = () => {}

    onMount(async () => {
        requestPermissions().then(
            function success() {
                console.log(`Camera permission granted.`)
                // error = `Camera permission granted!`
            },
            function failure() {
                console.log(`Camera permission denied.`)
                error = `Allow camera access in device settings`
            }
        )
    })

    const onCameraButtonTap = async () => {
        try {
            const imageAsset = await camera.takePicture(cameraOptions);
            imageRef.src = imageAsset
            cameraLabelVisibility = 'hidden'
            console.log(`Image taken: ${image.src}`)
        } catch (err) {
            console.error(err)
            // cameraLabelVisibility = 'visible'
        }
    }
  
    const onSubmit = async () => {
      /**
       * body register form submission.  Update authentication store if successful.  Show error if not.
       */
      // console.log(
      //   `Form data: title='${title}', body='${body}''`,
      // )
  
      try {
        const response = await fetch(`${config.WIKISTREETS_API}/posts/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, body }),
        })
  
        const data = await response.json()
        if (response.ok) {
          // check for a token and update auth store if present
            onComplete('Create post success')
        } else if (data.error) {
            error = data.error
            // console.error(error)
        } 
      } catch (err) {
        error = err
        // console.error(error)
      }
    }
  </script>
  
  <page {...$$restProps}>
    <actionBar title="">
      <actionItem
        ios.position="left"
        android.position="actionBar"
        ios.systemIcon="24"
        android.systemIcon="ic_menu_close_clear_cancel"
        text="Cancel"
        on:tap={() => onComplete('Create post form canceled')}
      />
      <actionItem
        ios.position="right"
        android.position="actionBar"
        text="Save"
        on:tap={onSubmit}
      />
    </actionBar>
  
    <scrollView orientation="vertical" scrollBarIndicatorVisible={false}>

        <stackLayout orientation="vertical" horizontalAlignment="center" class="w-full" >

            <!-- photo box -->
            <gridLayout rows="*" columns="*" height="300" width="300" class="mx-auto align-middle text-center mt-8" on:tap={onCameraButtonTap}>
                <image bind:this={image} row={1} col={1} class="bg-slate-200" />
                <label visibility="{cameraLabelVisibility}" row={1} col={1} text="{icons.camera}" class="text-5xl icon text-center align-middle text-lg text-slate-500" />
            </gridLayout>
        
            <!-- form fields -->
            <textView editable={false} class="m-4 h-8 text-center">
                <span class="w-full text-center text-lg my-0 p-4">
                {#if !error}
                    Create a new post
                {:else}
                    {error}
                {/if}
                </span>
            </textView>
        
            <textField
                hint="Title"
                bind:text={title}
                autocapitalizationType="sentences"
                autocorrect="true"
                class="text-lg p-4 my-4 border-2 rounded-md border-slate-600"
            />
            <textView
                hint="Body"
                bind:text={body}
                autocapitalizationType="sentences"
                autocorrect="true"
                editable="true"
                class="text-lg p-4 my-4 border-2 rounded-md border-slate-600"
            />
        
            <label
                class="w-1/2 text-lg text-center text-slate-700 p-4 my-4 rounded-md bg-slate-300"
                text="Save"
                on:tap={onSubmit}
            />
        
            <textView
                editable={false}
                class="m-4 text-center"
                on:tap={() => onComplete('Create post form canceled')}
            >
                <span class="text-md p-4 text-black dark:text-white">
                Cancel
                </span>
            </textView>
        </stackLayout>
    </scrollView>

  </page>
  