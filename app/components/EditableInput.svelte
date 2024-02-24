<script lang="ts">
  export let text: string = 'Enter here...'
  export let label: string = ''
  export let onChange: Function = () => {}
  export let secure: 'true' | 'false' = 'false'
  export let keyboardType:
    | 'number'
    | 'datetime'
    | 'phone'
    | 'url'
    | 'email'
    | 'integer'
    | null = null
  export let autocorrect: 'true' | 'false' = 'false'
  export let autocapitalizationType:
    | 'none'
    | 'words'
    | 'sentences'
    | 'allcharacters' = 'none'

  let editable: boolean = false

  const onSubmit = () => {
    editable = false
    console.log(`onSubmit: ${label} -> ${text}`) // debugging
    onChange(text)
  }

  const toggleEditable = () => {
    editable = editable ? false : true
  }
</script>

<flexboxLayout {...$$restProps}>
  <label text={label} on:tap={toggleEditable} class="text-lg text-left w-1/4" />
  {#if editable}
    <textField
      hint={text}
      bind:text
      {secure}
      {autocorrect}
      {keyboardType}
      {autocapitalizationType}
      class="w-1/2 text-lg p-4 px-4 my-0 border-2 rounded-md border-slate-500"
      on:returnPress={onSubmit}
    />
    <label
      class="w-1/4 text-lg text-center text-slate-700 p-4 my-0 rounded-md bg-slate-300"
      text="Save"
      on:tap={onSubmit}
    />
  {:else}
    <label {text} on:tap={toggleEditable} class="w-1/2 text-lg p-4 my-0" />
    <label
      class="w-1/4 text-lg text-center text-slate-700 p-4 my-0 rounded-md bg-slate-300"
      text="Edit"
      on:tap={() => (editable = true)}
    />
  {/if}
</flexboxLayout>

<style>
</style>
