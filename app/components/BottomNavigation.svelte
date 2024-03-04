<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { Frame, Page } from '@nativescript/core'
    import { icons } from '../utils/icons'
    import Map from '~/pages/Map.svelte'
    import Feed from '~/pages/Feed.svelte'
    import CreatePost from '~/pages/CreatePost.svelte'
    import Search from '~/pages/Search.svelte'
    import Settings from '~/pages/Settings.svelte'
    import { navigate } from 'svelte-native'


    const dispatch = createEventDispatcher(); // for emitting messages to parent component

    const onTabTap = (page: any) => {
        // dispatch('navTap', { page })
        navigate({
            frame: Frame.getFrameById('mainFrame'),
            page,
            clearHistory: true,
            animated: false,
        })
    }

</script>

<page title="" {...$$restProps} actionBarHidden={true} class="w-full h-full">
    <flexboxLayout class="w-full h-full">
        <label text="{icons.map}" class="text-2xl icon text-center m-1 w-full h-full" on:tap={() => onTabTap(Map)} />
        <label text="{icons['format-list-bulleted']}" class="text-2xl icon text-center m-1 w-full h-full"  on:tap={() => onTabTap(Feed)} />
        <label text="{icons['plus-box']}" class="text-5xl icon text-center m-1 w-full h-full" on:tap={() => onTabTap(CreatePost)} />
        <label text="{icons.search}" class="text-2xl icon text-center m-1 w-full h-full" on:tap={() => onTabTap(Search)} />
        <label text="{icons.account}" class="text-2xl icon text-center m-1 w-full h-full" on:tap={() => onTabTap(Settings)} />
    </flexboxLayout>
</page>

<style>
</style>