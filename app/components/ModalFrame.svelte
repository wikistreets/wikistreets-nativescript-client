<script lang="ts">
  import { navigate, closeModal } from 'svelte-native'
  import Login from '~/pages/Login.svelte'
  import Register from '~/pages/Register.svelte'
  import Settings from '~/pages/Settings.svelte'
  import PostDetails from '~/pages/PostDetails.svelte'
  import CreateCollection from '~/pages/CreateCollection.svelte'

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
  {:else if pageName === 'PostDetails'}
    <PostDetails {...$$restProps} {onComplete} />
  {:else if pageName === 'CreateCollection'}
    <CreateCollection {...$$restProps} {onComplete} />
  {/if}
</frame>
