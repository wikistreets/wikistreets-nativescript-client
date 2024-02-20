<!-- @component Log in form. -->

<script lang="ts">
  import { navigate, closeModal } from 'svelte-native'
  import Register from '~/pages/Register.svelte'

  let email: string = ''
  let password: string = ''
  const onSubmit = () => {
    console.log(`Form data: email='${email}', password='${password}'`)
    closeModal('Login form submitted')
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
    <textField
      hint="Email"
      text={email}
      on:textChange={e => (email = e.value)}
      keyboardType="email"
      autocorrect="false"
      autocapitalizationType="none"
      class="text-lg p-4"
    />
    <textField
      hint="Password"
      text={password}
      on:textChange={e => (password = e.value)}
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
