<!-- @component Hamburger menu with different options for logged-in and logged-out users -->

<script lang="ts">
  import { Drawer } from '@nativescript-community/ui-drawer'
  import { navigate, showModal } from 'svelte-native'
  import { Page, Frame } from '@nativescript/core'
  import { l, lc, lt } from '~/services/localeService'
  import { user, isAuthenticated, logout } from '~/stores/auth'
  import ModalFrame from '~/components/ModalFrame.svelte'
  import Map from '~/pages/Map.svelte'
  import { Collection } from '~/models/feature'
  import { icons } from '../utils/icons'

  export let collectionPage: Page = Map

  // mock collections
  const collections: Collection[] = [
    {
      _id: 0,
      title: lc('HamburgerMenu.collections.default'),
      type: 'FeatureCollection',
      features: []
    },
    {
      _id: 1,
      title: 'Apple Picking Spots',
      type: 'FeatureCollection',
      features: []
    }, 
    {
      _id: 2,
      title: 'HomeExchange in Croton',
      type: 'FeatureCollection',
      features: []
    },
    {
      _id: 3,
      title: 'Trip to Washington D.C.',
      type: 'FeatureCollection',
      features: []
    }

  ]

  const onCollectionTap = (selectedCollection: Collection) => {
      // dispatch('navTap', { page })
      const frame = Frame.getFrameById('mainFrame')
      navigate({
          frame,
          page: collectionPage,
          clearHistory: true,
          animated: false,
          props: {
              selectedCollection
          }
      })
  }

  const cleanNavigateTo = (page: Page | null): void => {
    /**
     * Navigate to a different page with no history or animation.
     */
    drawer.close()
    if (page) {
      navigate({
        page,
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
     * Open a modal dialog with the ModalFrame component and pass an inner child page to show within.
     */
    drawer.close()
    if (pageName) {
      showModal({
        page: ModalFrame,
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

<gridlayout {...$$restProps} rows='*, 0' cols='*,0'>
  <contentView row={0} col={0} class='w-full h-full'>
    <frame id="menu">
      <page actionBarHidden={true}>
        <stacklayout class='p-16'>

          <!-- BEGIN: collections -->
          <stacklayout style="margin-top: 3%;">
            <label text='{lc('HamburgerMenu.collections.heading')}' style="margin-bottom: 4rem; margin-top: 0; margin-left: 0; margin-right: 0;" class='font-medium text-heading-sm' />
            {#each collections as collection}
              <button text={collection.title} textWrap={false} lineHeight={0} style="margin-top: 2rem; margin-bottom: 2rem; margin-left: 0; margin-right: 0; padding: 0;" class='text-left text-body-sm text-t-light-primary bg-transparent' boxShadow='none' on:tap={() => {
                onCollectionTap(collection)
              }} />
            {/each}
            <button text="{lc('HamburgerMenu.collections.createNew')}" textWrap={true} style="margin-top: 10rem; margin-bottom: 0; margin-left: 0; margin-right: 0; padding: 14rem; border-radius: 5rem;" class='text-center text-body-sm text-t-light-primary bg-s-light-brand' boxShadow='none' />
          </stacklayout>
          <!-- END: collections -->

          <!-- BEGIN: account stuff -->
          <stacklayout style="margin-top: 7%;">
            <label text='{lc('HamburgerMenu.account.heading')}' style="margin-bottom: 4rem; margin-top: 0; margin-left: 0; margin-right: 0;" class='font-medium text-heading-sm' />
            {#if $isAuthenticated}
            <stacklayout class="p-12 align-middle text-center">
              <label class="w-full" text={$user?.handle} />
              <label class="w-full" text={$user?.email} />
            </stacklayout>
            <button text='{lc('HamburgerMenu.profile')}' textWrap={false} lineHeight={0} class='text-left first-line:text-body-sm text-t-light-primary m-0 p-0 bg-transparent' boxShadow='none'  on:tap={() => modalTo('Settings')} />
            {:else}
            <button text='{lc('HamburgerMenu.account.signIn')}' textWrap={false} lineHeight={0} style="margin-top: 2rem; margin-bottom: 0; margin-left: 0; margin-right: 0; padding: 0;" class='text-left text-body-sm text-t-light-primary bg-transparent' boxShadow='none'  on:tap={() => modalTo('Login')} />
            <button text='{lc('HamburgerMenu.account.register')}' textWrap={false} lineHeight={0} style="margin-top: 2rem; margin-bottom: 0; margin-left: 0; margin-right: 0; padding: 0;" class='text-left text-body-sm text-t-light-primary bg-transparent' boxShadow='none'  on:tap={() => modalTo('Register')} />
            {/if}
          </stacklayout>
          <!-- END: account stuff -->

        </stacklayout>
      </page>
    </frame>
  </contentView> 
</gridlayout>
