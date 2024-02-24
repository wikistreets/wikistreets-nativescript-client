<!-- @component Account Settings -->

<script lang="ts">
  import { navigate, goBack } from 'svelte-native'
  import { token, user } from '~/stores/auth'
  import { config } from '~/config/config'
  import EditableInput from '~/components/EditableInput.svelte'

  let email: string
  let handle: string
  let password: string
  $: email = $user?.email
  $: handle = $user?.handle
  $: password = $user?.password

  let error: string

  const onSettingChange = async setting => {
    /**
     * Handle account settings form submission.  Update authentication store if successful.  Show error if not.
     */

    error = null // clear any prior error
    console.log(`Form data: ${JSON.stringify(setting)}`)

    try {
      const response = await fetch(`${config.WIKISTREETS_API}/users/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${$token}`, // necessary for JWT authentication
        },
        body: JSON.stringify(setting),
      })

      const data = await response.json()
      if (response.ok) {
        // check for a token and update auth store if present
        if (data.token) {
          console.log(`Token received: ${data.token}`)
          token.set(data.token)
          user.set(data.user)
          // closeModal('Registration successful')
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
  <actionBar title="Settings">
    <navigationButton
      text="Back"
      android.systemIcon="ic_menu_back"
      on:tap={goBack}
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
        Your account settings.
      </span>
    </textView>

    {#if error}
      <textView editable={false} class="m-4 h-8 text-center">
        <span class="text-lg p-4 text-red dark:text-red">
          {error}
        </span>
      </textView>
    {/if}

    <EditableInput
      label="Email"
      text={email}
      keyboardType="email"
      onChange={value => {
        email = value
        onSettingChange({ email })
      }}
      class="m-4"
    />

    <EditableInput
      label="Handle"
      text={handle}
      onChange={value => {
        handle = value
        onSettingChange({ handle })
      }}
      class="m-4"
    />

    <EditableInput
      label="Password"
      text="************"
      secure="true"
      onChange={value => {
        handle = value
        onSettingChange({ password })
      }}
      class="m-4"
    />
  </stackLayout>
</page>
