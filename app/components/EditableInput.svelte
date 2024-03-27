<script lang="ts">
  import { EventData } from '@nativescript/core'
  import { TapGestureEventData } from "@nativescript/core/ui/gestures"
  import { l, lc } from '~/services/localeService'

  export let label: string = ''
  export let text: string
  export let hint: string = lc('EditableInput.form.text.hint')
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

  const onSubmit = (e: EventData) => {
    editable = false
    console.log(`onSubmit: ${label} -> ${text}`) // debugging
    onChange(text)
  }

  const toggleEditable = (e: TapGestureEventData) => {
    editable = editable ? false : true
  }
</script>

<flexboxLayout {...$$restProps}>
  <label text={label} on:tap={toggleEditable} class="text-lg text-left w-1/4" />
  {#if editable}
    <textField
      hint={hint}
      bind:text
      {secure}
      {autocorrect}
      {keyboardType}
      {autocapitalizationType}
      class="w-1/2 text-lg p-4 px-4 my-0 border-2 rounded-md border-slate-500"
      on:returnPress={onSubmit}
    />
    <label
      class="w-1/4 text-sm text-center text-slate-700 p-4 my-0 rounded-md bg-slate-300"
      text="{lc('common.buttons.save')}"
      on:tap={onSubmit}
    />
  {:else}
    <label {text} on:tap={toggleEditable} class="w-1/2 text-lg p-4 my-0" />
    <label
      class="w-1/4 text-sm text-center text-slate-700 p-4 my-0 rounded-md bg-slate-300"
      text="{lc('common.buttons.edit')}"
      on:tap={() => (editable = true)}
    />
  {/if}
</flexboxLayout>

<style>
</style>
