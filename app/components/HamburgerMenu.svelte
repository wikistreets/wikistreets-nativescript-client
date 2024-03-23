<!-- @component Hamburger menu with different options for logged-in and logged-out users -->

<script lang="ts">
  import { Drawer } from '@nativescript-community/ui-drawer'
  import { navigate, showModal } from 'svelte-native'
  import { Page, Frame } from '@nativescript/core'
  import { l, lc } from '~/services/localeService'
  import { user, isAuthenticated, logout } from '~/stores/auth'
  import AuthModalFrame from '~/components/AuthModalFrame.svelte'
  import Map from '~/pages/Map.svelte'
  import { Collection } from '~/models/feature'

  export let collectionPage: Page = Map

  // mock collections
  const collections: Collection[] = [
    {
      _id: 0,
      title: lc('collections.default'),
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

<gridlayout {...$$restProps} rows='*, 0' cols='*,0'>
  <contentView row={0} col={0} class='w-full h-full'>
    <frame id="menu">
      <page actionBarHidden={true}>
        <stacklayout class='p-4'>

          <!-- BEGIN: collections -->
          <stacklayout class='m-0 my-2 p-0'>
            <label text='Collections' class='font-bold text-2xl' />
            {#each collections as collection}
              <button text={collection.title} textWrap={false} lineHeight={0} class='text-left text-lg mx-4 my-1 bg-transparent' boxShadow='none' on:tap={() => {
                onCollectionTap(collection)
              }} />
            {/each}
            <button text="+ {lc('collections.create-new')}" textWrap={true} class='text-left text-lg mx-4 my-1 bg-transparent' boxShadow='none' />
          </stacklayout>
          <!-- END: collections -->

          <!-- BEGIN: account stuff -->
          <stacklayout class='m-0 my-2 p-0'>
            <label text='Account' class='font-bold text-2xl' />
            {#if $isAuthenticated}
            <stacklayout class="p-12 align-middle text-center">
              <label class="w-full" text={$user?.handle} />
              <label class="w-full" text={$user?.email} />
            </stacklayout>
            <button text='{lc('account.profile')}' textWrap={false} lineHeight={0} class='text-left text-lg mx-4 my-1 bg-transparent' boxShadow='none'  on:tap={() => modalTo('Settings')} />
            {:else}
            <button text='{lc('account.sign-in')}' textWrap={false} lineHeight={0} class='text-left text-lg mx-4 my-1 bg-transparent' boxShadow='none'  on:tap={() => modalTo('Login')} />
            <button text='{lc('account.register')}' textWrap={false} lineHeight={0} class='text-left text-lg mx-4 my-1 bg-transparent' boxShadow='none'  on:tap={() => modalTo('Register')} />
            {/if}
          </stacklayout>
          <!-- END: account stuff -->

        </stacklayout>
      </page>
    </frame>
  </contentView> 
</gridlayout>
