<script lang="ts">
  export let text: string = 'Enter here...'
  export let label: string = ''
  export let onChange: Function = () => {}
  export let keyboardType:
    | 'number'
    | 'datetime'
    | 'phone'
    | 'url'
    | 'email'
    | 'integer'
    | null = null
  export let autocorrect: string = 'false'
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
  <label text={label} on:tap={toggleEditable} class="text-lg text-left w-1/3" />
  {#if editable}
    <textField
      hint={text}
      bind:text
      {autocorrect}
      {keyboardType}
      {autocapitalizationType}
      class="w-1/3 text-lg py-4 px-0"
    />
    <button class="text-xl w-1/3 px-0" text="Save" on:tap={onSubmit} />
  {:else}
    <label
      {text}
      on:tap={toggleEditable}
      class="text-lg text-left w-1/3 px-0"
    />
    <button
      class="text-xl w-1/3 px-0"
      text="Edit"
      on:tap={() => (editable = true)}
    />
  {/if}
</flexboxLayout>

<style>
</style>
