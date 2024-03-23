<!-- @component Log in form. -->

<script lang="ts">
    import { navigate, closeModal } from 'svelte-native'
    import { lc } from '@nativescript-community/l'
    import { token, user } from '~/stores/auth'
    import { config } from '~/config/config'
  
    let name: string = ''
    let description: string = ''
    let isPrivate: boolean = false
  
    let error: string
  
    export let onComplete: Function = () => {}
  
    const onSubmit = async () => {
      /**
       * Handle login form submission.  Update authentication store if successful.  Show error if not.
       */
      error = '' // clear any prior error
      // console.log(`Form data: email='${email}', password='${password}'`)
  
      try {
        const response = await fetch(`${config.WIKISTREETS_API}/collections/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, description, isPrivate }),
        })
  
        const data = await response.json()
        if (response.ok) {
          // check for a token and update auth store if present
          if (data.error) {
            error = data.error
            // console.error(error)
          }
        } else {
          error = data?.error
          // console.error(error)
        }
      } catch (err) {
        error = err
        // console.error(err)
      }
    }
  </script>
  
  <page {...$$restProps}>
    <actionBar title="" flat="true">
      {#if __ANDROID__}
        <navigationButton
          android.systemIcon="ic_menu_close_clear_cancel"
          text="{ lc('common.buttons.cancel') }"
          on:tap={e => { onComplete('Login canceling') }}
        />
      {:else }
      <actionItem
        ios.position="left"
        android.position="actionBar"
        ios.systemIcon="24"
        android.systemIcon="ic_menu_close_clear_cancel"
        text="{ lc('common.buttons.cancel') }"
        on:tap={e => { onComplete('Login canceling') }}
      />
      {/if}
      <actionItem
        ios.position="right"
        android.position="actionBar"
        text="{ lc('common.buttons.create') }"
        on:tap={onSubmit}
      />
    </actionBar>
  
    <stackLayout
      orientation="vertical"
      horizontalAlignment="center"
      class="w-full"
    >
  
      <textView editable={false} class="m-4 h-8 text-center">
        <span class="w-full text-center text-lg my-0 p-4">
          {#if !error}
            { lc('CreateCollection.description') }
          {:else}
            {error}
          {/if}
        </span>
      </textView>
  
      <textField
        hint="{ lc('CreateCollection.form.name.hint') }"
        bind:text={name}
        autocapitalizationType="sentences"
        autocorrect="true"
        class="text-lg p-4 my-4 border-2 rounded-md border-slate-500"
      />

      <textViewWithHint
        hint="{ lc('CreateCollection.form.description.hint') }"
        bind:text={description}
        autocapitalizationType="sentences"
        autocorrect="true"
        class="text-lg p-4 my-4 border-2 rounded-md border-slate-600"
      />

      <gridLayout columns="auto, *" rows="auto, 0" class="p-4 pl-0 my-0">
        <switch row={0} col={0} bind:checked={isPrivate} />
        <label row={0} col={1} class="text-lg ml-4" text="{ lc('CreateCollection.form.isPrivate.label') }" />
      </gridLayout>

      <label
        class="w-1/2 text-lg text-center text-slate-700 p-4 my-4 rounded-md bg-slate-300"
        text="{ lc('common.buttons.create') }"
        on:tap={onSubmit}
      />

    </stackLayout>
  </page>
  