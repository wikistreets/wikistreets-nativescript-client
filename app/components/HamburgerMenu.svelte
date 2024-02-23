<!-- @component Hamburger menu with different options for logged-in and logged-out users -->

<script lang="ts">
  import { Drawer } from '@nativescript-community/ui-drawer'
  import { navigate, showModal } from 'svelte-native'
  import { Page, Frame } from '@nativescript/core'
  import { user, isAuthenticated, logout } from '~/stores/auth'
  import AuthModalFrame from '~/components/AuthModalFrame.svelte'
  import Home from '~/pages/Home.svelte'

  const navigateTo = (pageRef: Page | null): void => {
    /**
     * Navigate to a different page.
     */
    drawer.close()
    if (pageRef) {
      navigate({
        page: pageRef,
        clearHistory: true,
        animated: false,
        props: {
          actionBarHidden: false,
        },
      })
    }
  }

  const modalTo = (pageName: string | null): void => {
    /**
     * Open a modal dialog with the AuthModalFrame component and pass an inner child page to show within.
     */
    drawer.close()
    if (pageName) {
      showModal({
        page: AuthModalFrame,
        animated: true,
        props: {
          pageName: pageName,
          actionBarHidden: false,
        },
      })
    }
  }

  const onLogout = () => {
    /**
     * Log out the user and close the drawer.
     */
    logout()
    drawer.close()
  }

  export let drawer: Drawer
</script>

<gridlayout {...$$restProps}>
  <stacklayout row="0" class="bg-gray-800">
    {#if $isAuthenticated}
      <stacklayout class="w-full p-12 align-middle text-center">
        <label class="w-full" text={$user?.handle} />
        <label class="w-full" text={$user?.email} />
      </stacklayout>
    {/if}
    <stacklayout class="p-12 pb-24 align-middle text-center">
      <button
        text="- Home -"
        color="black"
        backgroundColor="white"
        on:tap={() => {
          navigateTo(Home)
        }}
      />
      {#if $isAuthenticated}
        <button
          text="- Log out -"
          color="black"
          backgroundColor="white"
          on:tap={() => {
            onLogout()
          }}
        />
      {:else}
        <button
          text="- Log in -"
          color="black"
          backgroundColor="white"
          on:tap={() => {
            modalTo('Login')
          }}
        />
        <button
          text="- Register -"
          color="black"
          backgroundColor="white"
          on:tap={() => {
            modalTo('Register')
          }}
        />
      {/if}
      <button
        text="- Contact -"
        color="black"
        backgroundColor="white"
        on:tap={() => {
          navigateTo(null)
        }}
      />
    </stacklayout>
  </stacklayout>
</gridlayout>
