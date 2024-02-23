<!-- @component Log in form. -->

<script lang="ts">
  import { navigate, closeModal } from 'svelte-native'
  import Register from '~/pages/Register.svelte'
  import { token, user } from '~/stores/auth'
  import { config } from '~/config/config'

  let email: string = ''
  let password: string = ''

  let error: string

  const onSubmit = async () => {
    /**
     * Handle login form submission.  Update authentication store if successful.  Show error if not.
     */
    console.log(`Form data: email='${email}', password='${password}'`)

    try {
      const response = await fetch(`${config.WIKISTREETS_API}/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (response.ok) {
        // check for a token and update auth store if present
        if (data.token) {
          console.log(`Token received: ${data.token}`)
          token.set(data.token)
          user.set(data.user)
          closeModal('Login successful')
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
      on:tap={() => closeModal('Login form canceled')}
    />
    <actionItem
      ios.position="right"
      android.position="actionBar"
      ios.systemIcon="3"
      text="Log in"
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
        Log in to your account.
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
      hint="Password"
      bind:text={password}
      secure="true"
      autocorrect="false"
      autocapitalizationType="none"
      class="text-lg p-4"
    />
    <button class="my-8 p-4 text-xl" text="- Log in -" on:tap={onSubmit} />
    <textView
      editable={false}
      class="m-4 text-center"
      on:tap={() =>
        navigate({ page: Register, clearHistory: true, animated: false })}
    >
      <span class="text-md p-4 text-black dark:text-white">
        Don't have an account?
      </span>
    </textView>
  </stackLayout>
</page>
