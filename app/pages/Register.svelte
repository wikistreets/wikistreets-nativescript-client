<!-- @component Register form for new users. -->

<script lang="ts">
  import { navigate, closeModal } from 'svelte-native'
  import { TextField } from '@nativescript/core'
  import { authStore } from '~/stores/auth'
  import { config } from '~/config/config'
  import Login from '~/pages/Login.svelte'

  let email: string
  let handle: string
  let password: string

  let error: string

  const onSubmit = async () => {
    console.log(
      `Form data: email='${email}', handle='${handle}', password='${password}'`,
    )

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
        const { token, user } = data
        // check for a token and update auth store if present
        if (token) {
          console.log(`Token received: ${data.token}`)
          authStore.token.set(token)
          authStore.user.set(user)
          closeModal('Registration successful')
        } else if (data.error) {
          error = data.error
          console.error(error)
        } else {
          error = 'No token found in response'
          console.error(error)
        }
      } else {
        error = data?.error
        console.error(error)
      }
    } catch (err) {
      error = err
      console.error(error)
    }
  }
</script>

<page {...$$restProps}>
  <actionBar>
    <actionItem
      ios.position="left"
      android.position="actionBar"
      ios.systemIcon="24"
      text="Cancel"
      on:tap={() => closeModal('Register form canceled')}
    />
    <actionItem
      ios.position="right"
      android.position="actionBar"
      ios.systemIcon="3"
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
      <span class="text-lg p-4 text-black dark:text-white">
        Register to make a new account
      </span>
    </textView>

    {#if error}
      <textView editable={false} class="m-4 h-8 text-center">
        <span class="text-lg p-4 text-red dark:text-red">
          {error}
        </span>
      </textView>
    {/if}

    <textField
      hint="Email"
      bind:text={email}
      keyboardType="email"
      autocorrect="false"
      autocapitalizationType="none"
      class="text-lg p-4"
    />
    <textField
      hint="handle"
      bind:text={handle}
      autocorrect="false"
      autocapitalizationType="none"
      class="text-lg p-4"
    />
    <textField
      hint="Password"
      bind:text={password}
      secure="true"
      autocorrect="false"
      autocapitalizationType="none"
      class="text-lg p-4"
    />
    <button class="mt-8 p-4 text-xl" text="- Register -" on:tap={onSubmit} />
    <textView
      editable={false}
      class="m-4 text-center"
      on:tap={() =>
        navigate({ page: Login, clearHistory: true, animated: false })}
    >
      <span class="text-md p-4 text-black dark:text-white">
        Already have an account?
      </span>
    </textView>
  </stackLayout>
</page>
