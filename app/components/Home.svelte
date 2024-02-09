<page>
    <actionBar title="Home" />

    <stackLayout height="100%">
        <listView height="100%" separatorColor="transparent" items="{features}">
        <Template let:item>
            <label class="text-sky-400" text="{item.properties.title}" />
        </Template>
        </listView>
    </stackLayout>
</page>

<script>
  // Add this 👇
  import { Template } from 'svelte-native/components'
  import { FeatureService } from '../services/FeatureService'

  let features = FeatureService.getInstance().getFeatures()
</script>

<style>
    .info .fas {
        color: #3A53FF;
    }

    .info {
        font-size: 20;
        horizontal-align: center;
        vertical-align: center;
    }
</style>
