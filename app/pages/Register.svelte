<!-- @component Register form for new users. -->

<script lang="ts">
  import { navigate, closeModal } from 'svelte-native'
  import { TextField } from '@nativescript/core'
  import { lc } from '@nativescript-community/l'
  import { user, token } from '~/stores/auth'
  import { config } from '~/config/config'
  import Login from '~/pages/Login.svelte'

  let email: string
  let handle: string
  let password: string

  let error: string

  export let onComplete: Function = () => {}

  const onSubmit = async () => {
    /**
     * Handle register form submission.  Update authentication store if successful.  Show error if not.
     */
    // console.log(
    //   `Form data: email='${email}', handle='${handle}', password='${password}'`,
    // )

    try {
      const response = await fetch(`${process.env.WIKISTREETS_API}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, handle, password }),
      })

      const data = await response.json()
      if (response.ok) {
        // check for a token and update auth store if present
        if (data.token) {
          // console.log(`Token received: ${data.token}`)
          token.set(data.token)
          user.set(data.user)
          onComplete('Registration successful')
        } else if (data.error) {
          error = data.error
          // console.error(error)
        } else {
          error = 'No token found in response'
          // console.error(error)
        }
      } else {
        error = data?.error
        // console.error(error)
      }
    } catch (err) {
      error = err
      // console.error(error)
    }
  }
</script>

<page {...$$restProps}>
  <actionBar title="" flat="true">
    {#if __ANDROID__}
      <navigationButton
        android.systemIcon="ic_menu_close_clear_cancel"
        text="{ lc('common.buttons.cancel') }"
        on:tap={e => { onComplete('Register canceling') }}
      />
    {:else }
    <actionItem
      ios.position="left"
      android.position="actionBar"
      ios.systemIcon="24"
      android.systemIcon="ic_menu_close_clear_cancel"
      text="{ lc('common.buttons.cancel') }"
      on:tap={e => { onComplete('Register canceling') }}
    />
    {/if}    <actionItem
      ios.position="right"
      android.position="actionBar"
      text="{ lc('common.buttons.register') }"
      on:tap={onSubmit}
    />
  </actionBar>

  <stackLayout
    orientation="vertical"
    horizontalAlignment="center"
    class="w-full"
    style="padding: 28rem; margin-top: 32rem; margin-bottom: 0; margin-left: 0; margin-right: 0;"
  >
    <!-- <image src="~/assets/share_image.png" class="mt-8 w-32 h-32" /> -->

    <textView editable={false} class="w-full text-left">
      <span class="text-heading-md font-bold m-0">
        {#if !error}
        { lc('Register.description')}
        {:else}
          {error}
        {/if}
      </span>
    </textView>

    <textField
      hint="{ lc('Register.form.email.hint') }"
      bind:text={email}
      keyboardType="email"
      autocapitalizationType="none"
      autocorrect="false"
     style="padding-top: 16rem; padding-bottom: 16rem; padding-left: 0; padding-right: 0; margin-bottom: 20rem; margin-top: 0; margin-left: 0; margin-right: 0;"
      class="text-label-md border-b-2 border-b-s-light-primary placeholder-t-light-secondary"
    />
    <textField
      hint="{ lc('Register.form.handle.hint') }"
      bind:text={handle}
      autocapitalizationType="none"
      autocorrect="false"
      style="padding-top: 16rem; padding-bottom: 16rem; padding-left: 0; padding-right: 0; margin-bottom: 20rem; margin-top: 0; margin-left: 0; margin-right: 0;"
      class="text-label-md border-b-2 border-b-s-light-primary placeholder-t-light-secondary"
    />
    <textField
      hint="{ lc('Register.form.password.hint') }"
      bind:text={password}
      secure="true"
      autocapitalizationType="none"
      autocorrect="false"
      style="padding-top: 16rem; padding-bottom: 16rem; padding-left: 0; padding-right: 0; margin-bottom: 30rem; margin-top: 0; margin-left: 0; margin-right: 0;"
      class="text-label-md border-b-2 border-b-s-light-primary placeholder-t-light-secondary"
      on:returnPress={onSubmit}
    />

    <label
      style="padding: 14rem; border-radius: 5rem;"
      class="w-full text-body-md text-center text-t-light-primary bg-s-light-brand"
      text="{ lc('common.buttons.register') }"
      on:tap={onSubmit}
    />

    <textView
      editable={false}
       style="margin-top: 12rem; margin-bottom: 0; margin-left: 0; margin-right: 0;"
      class="text-center"
      on:tap={() =>
        navigate({
          page: Login,
          clearHistory: true,
          animated: false,
          props: { onComplete },
        })}
    >
      <span class="text-label-md px-4 text-t-light-secondary dark:text-white">
        { lc('Register.loginLink') }
      </span>
    </textView>
  </stackLayout>
</page>
