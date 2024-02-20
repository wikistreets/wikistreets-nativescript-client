<script lang="ts">
  import Login from '~/pages/Login.svelte'
  import Register from '~/pages/Register.svelte'

  export let pageName: string = 'Login'
</script>

<frame id="modal-frame">
  {#if pageName === 'Login'}
    <Login {...$$restProps} />
  {:else if pageName === 'Register'}
    <Register {...$$restProps} />
  {/if}
</frame>
