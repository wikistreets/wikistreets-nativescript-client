<!-- @component Register form for new users. -->

<script lang="ts">
  import { navigate, closeModal } from 'svelte-native'
  import { TextField } from '@nativescript/core'
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
      const response = await fetch(`${config.WIKISTREETS_API}/users/signup`, {
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
  <actionBar title="Sign up">
    <actionItem
      ios.position="left"
      android.position="actionBar"
      ios.systemIcon="24"
      android.systemIcon="ic_menu_close_clear_cancel"
      text="Cancel"
      on:tap={() => onComplete('Register form canceled')}
    />
    <actionItem
      ios.position="right"
      android.position="actionBar"
      text="Register"
      on:tap={onSubmit}
    />
  </actionBar>

  <stackLayout
    orientation="vertical"
    horizontalAlignment="center"
    class="w-full"
  >
    <image src="~/assets/share_image.png" class="mt-8 w-32 h-32" />

    <textView editable={false} class="m-4 h-8 text-center">
      <span class="w-full text-center text-lg my-0 p-4">
        {#if !error}
          Create a new account
        {:else}
          {error}
        {/if}
      </span>
    </textView>

    <textField
      hint="Email"
      bind:text={email}
      keyboardType="email"
      autocapitalizationType="none"
      autocorrect="false"
      class="text-lg p-4 my-4 border-2 rounded-md border-slate-600"
    />
    <textField
      hint="Handle"
      bind:text={handle}
      autocapitalizationType="none"
      autocorrect="false"
      class="text-lg p-4 my-4 border-2 rounded-md border-slate-600"
    />
    <textField
      hint="Password"
      bind:text={password}
      secure="true"
      autocapitalizationType="none"
      autocorrect="false"
      class="text-lg p-4 my-4 border-2 rounded-md border-slate-600"
      on:returnPress={onSubmit}
    />

    <label
      class="w-1/2 text-lg text-center text-slate-700 p-4 my-4 rounded-md bg-slate-300"
      text="Register"
      on:tap={onSubmit}
    />

    <textView
      editable={false}
      class="m-4 text-center"
      on:tap={() =>
        navigate({
          page: Login,
          clearHistory: true,
          animated: false,
          props: { onComplete },
        })}
    >
      <span class="text-md p-4 text-black dark:text-white">
        Already have an account?
      </span>
    </textView>
  </stackLayout>
</page>
