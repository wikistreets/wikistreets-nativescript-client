<script lang="ts">
  import { Drawer } from '@nativescript-community/ui-drawer'
  import { navigate, showModal } from 'svelte-native'
  import { Page, Frame } from '@nativescript/core'
  import AuthModalFrame from '~/components/AuthModalFrame.svelte'
  import Home from '~/pages/Home.svelte'

  const navigateTo = (pageRef: Page | null): void => {
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

  export let drawer: Drawer
</script>

<gridlayout {...$$restProps}>
  <stacklayout row="0" class="bg-gray-800">
    <stacklayout class="p-12 pb-24 align-middle text-center">
      <stacklayout col="0" class="avatar bg-white rounded-full w-24 h-24">
        <label class="text-black align-middle h-full text-lg" text="FB" />
      </stacklayout>
      <stacklayout>
        <label text="Foo Barstein" />
        <label text="foo.barstein@onepotcooking.com" />
      </stacklayout>
    </stacklayout>
    <stacklayout class="p-12">
      <!-- <button
        text="- Home -"
        color="white"
        borderColor="white"
        borderWidth="2"
        backgroundColor="black"
        on:tap={() => {
          navigateTo(Home)
        }}
      /> -->
      <button
        text="- Home -"
        color="black"
        backgroundColor="white"
        on:tap={() => {
          navigateTo(Home)
        }}
      />
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
