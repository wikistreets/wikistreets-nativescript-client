<script lang="ts">
  import { navigate, closeModal } from 'svelte-native'
  import Login from '~/pages/Login.svelte'
  import Register from '~/pages/Register.svelte'
  import Settings from '~/pages/Settings.svelte'

  export let pageName: string = 'Login'

  const onComplete: Function = (msg: string) => {
    /** Close the modal dialog and show a message. */
    closeModal(msg)
  }
</script>

<frame id="modal-frame">
  {#if pageName === 'Login'}
    <Login {...$$restProps} {onComplete} />
  {:else if pageName === 'Register'}
    <Register {...$$restProps} {onComplete} />
  {:else if pageName === 'Settings'}
    <Settings {...$$restProps} {onComplete} />
  {/if}
</frame>
