# Notes on using NativeScript with Svelte

## Layouts
All content must be placed within a [layout container](https://docs.nativescript.org/ui/#layout-containers).  Even multiple `frame` elements on a single page must be placed within a layout of some kind.

```xml
<page>
    <gridLayout columns="300, *">
        <frame col="0" defaultPage='conversation-list' />
        <frame col="1" defaultPage='conversation-details'/>
    </gridLayout>
</page>
```

## Frames
On iOS a frame always spans the full height of it's parent container, so it's not possible to resize it without placing it within a container that can constrain its size.

```xml
<gridLayout columns="300, *">
  <contentView col="0">
    <frame defaultPage="conversation-list" />
  </contentView>
  <contentView col="1">
    <frame defaultPage="conversation-details" />
  </contentView>
</gridLayout>
```

## Page
There are three ways to get access programmatically to a given `page`.

### Bind page to a variable
Bind the `page` component to a variable - notice that its data type is a `NativeViewElement`, not directly a `Page`.
```jsx
import { NativeViewElementNode } from 'svelte-native/dom';
import { Page } from '@nativescript/core'

let pageAsNativeElement: NativeViewElementNode<Page>

// ...

<page bind:this={pageAsNativeElement}>
    <!-- content -->
</page>
```

### Callback on page load
Call a callback function when the page is navigated to and access the page in the event data.  Note that the data type in this case is type `Page`.
```jsx
import { Page, EventData } from '@nativescript/core'

let pageAsPage: Page

const onPageLoad = (e: EventData) => {
    pageAsPage = e.object as Page // save reference to the current page
}

// ...

<page on:navigateTo={onPageLoad}>
    <!-- content -->
</page>
```

### Callback on component interaction
When a sub-component of a `page` is tapped or has other interactions, it is possible retrieve the `page` from which it belongs.  Note the data type will be `Page`.
```jsx
import { Page, EventData, Label } from '@nativescript/core'

let pageAsPage: Page

const onLabelTap = (e: EventData) {
    const label = e.object as Label
    page = label.page
}
// ...

<page>
    <label on:tap={onLabelTap} text='hi!' />
</page>
```


## Events

Managing events is simple with a mix of NativeScript and Svelte functionality.

### Nativescript tap and gesture events
User interface components in NativeScript have standard tap and gesture events they can emit, such as `on:tap`, `on:swipe`, and more.  Note that event data is passed as the [EventData](https://docs.nativescript.org/api/interface/EventData) class or one of its more more specific sub-classes.

```jsx
const onStackLayoutSwipe = (e: EventData) => {
    // do something
}
const on LabelTap = (e: EventData) => {
    // do something else
}

// ...

<stackLayout on:swipe={onStackLayoutSwipe}>
    <label on:tap={onLabelTap} text='hi!'>
</stackLayout>
```

### Svelte component directives
Svelte's [dispatch](https://svelte.dev/docs/component-directives) functionality makes it easy to bubble custom events up from child to parent components.

Inner.svelte:
```js
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();

// ...
dispatch('customEvent', { msg: 'hi' })
```

Outer.svelt
```jsx
import Inner from 'Inner.svelte'

const onCustomEvent = (e: CustomEvent) => {
    // note that the data is wrapped in e.detail.detail, rather than e.detail as you would normally expect in Svelte
    console.log(`Received message from Inner: ${e.detail.detail.msg}`)
}

// ...

<Inner on:customEvent={onCustomEvent} />
```

Note that, in Svelte, the `Outer.svelte` class could bubble up the event further up to its own parent by mentioning the expected event without defining its handler, e.g. `<Inner on:customEvent />`.  Thus, the parent component of `Outer` could import it and handle the event, e.g. `<Outer on:customEvent={onCustomEvent} />`


## Modal dialogs
Modal dialogs created with `showModal()` must contain a `frame`.  The documentation suggests that it is possible to open a `page` in a modal, but this is not the case.  Put the `page` within a `frame` and it works.

```js
import NotActuallyAPageButAFrame from 'NotActuallyAPageButAFrame.svelte'

// ... 

showModal({ 
    page: NotActuallyAPageButAFrame, 
    props: { 
        msg: 'hi' 
    }
})
```

