<!-- @component Account Settings -->

<script lang="ts">
import { l, lc } from '~/services/localeService'
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

// export let onComplete: Function = () => {}

const onSettingChange = async setting => {
  /**
   * Handle account settings form submission.  Update authentication store if successful.  Show error if not.
   */

  error = null // clear any prior error
  // console.log(`Form data: ${JSON.stringify(setting)}`)

  try {
    const response = await fetch(`${process.env.WIKISTREETS_API}/users/update`, {
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
        // console.log(`Token received: ${data.token}`)
        token.set(data.token)
        user.set(data.user)
        // onComplete('Settings updated')
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
  <actionBar title="{lc('Settings.title')}" flat="true">
    <!-- {#if __ANDROID__}
      <navigationButton
        android.systemIcon="ic_menu_close_clear_cancel"
        text="Cancel"
        on:tap={e => { onComplete('Settings canceling') }}
      />
    {:else }
    <actionItem
      ios.position="left"
      android.position="actionBar"
      ios.systemIcon="24"
      android.systemIcon="ic_menu_close_clear_cancel"
      text="Cancel"
      on:tap={e => { onComplete('Settings canceling') }}
    />
    {/if}     -->
    <!-- <actionItem
      ios.position="right"
      android.position="actionBar"
      text="Done"
      on:tap={() => {
        onComplete('Settings updated')
      }}
    /> -->
  </actionBar>

  <stackLayout
    orientation="vertical"
    horizontalAlignment="left"
    class="w-full"
    style="padding: 15rem;"
  >
    <!-- <image src="~/assets/share_image.png" class="mt-8 w-32 h-32" /> -->
    <!-- <textView editable={false} class="m-4 h-8 text-center">
      <span class="text-lg p-4 text-black dark:text-white">
        {lc('Settings.description')}
      </span>
    </textView> -->

    {#if error}
      <textView editable={false} class="m-4 h-6 text-center">
        <span class="text-body-md p-4 text-alert dark:text-alert">
          {error}
        </span>
      </textView>
    {/if}

    <label text="{lc('Settings.form.title')}" class="text-heading-sm font-medium"/>

    <EditableInput
      label="{lc('Settings.form.email.label')}"
      text={email}
      hint={lc('Settings.form.email.hint')}
      keyboardType="email"
      onChange={value => {
        email = value
        onSettingChange({ email })
      }}
      class="align-center p-8"
      style="margin-bottom: 15rem; margin-top: 15rem; margin-left: 0; margin-right: 0;"
    />

    <EditableInput
      label="{lc('Settings.form.handle.label')}"
      text={handle}
      hint={lc('Settings.form.handle.hint')}
      onChange={value => {
        handle = value
        onSettingChange({ handle })
      }}
      class="align-center p-8"
      style="margin-bottom: 15rem; margin-top: 0; margin-left: 0; margin-right: 0;"
    />

    <EditableInput
      label="{lc('Settings.form.password.label')}"
      text='********'
      hint={lc('Settings.form.password.hint')}
      secure="true"
      onChange={value => {
        handle = value
        onSettingChange({ password })
      }}
      class="align-center p-8"
      style="margin-bottom: 15rem; margin-top: 0; margin-left: 0; margin-right: 0;"
    />
  </stackLayout>
</page>
