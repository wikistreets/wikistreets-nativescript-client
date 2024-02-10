<script lang="ts">
  import * as geolocation from "@nativescript/geolocation";
  import { CoreTypes, TapGestureEventData } from "@nativescript/core"; // used to describe at what accuracy the location should get
  import { Template } from "svelte-native/components";
  import { FeatureService } from "../services/FeatureService";
  import { showModal } from "svelte-native";

  let features = FeatureService.getInstance().getFeatures();
  let selectListItemTemplate = (item: any, index: number, items: any[]) => {
    // different list item keys for even and odd rows
    return index % 2 === 0 ? "even" : "odd";
  };

  geolocation.enableLocationRequest().then(() => {
    geolocation
      .getCurrentLocation({
        desiredAccuracy: CoreTypes.Accuracy.high,
        maximumAge: 5000,
        timeout: 20000,
      })
      .then((currentLocation) => {
        console.log("My current latitude: ", currentLocation.latitude);
      });
  });

  let feedbackMessage: String = `Please don't pet the animals.  Click on them.`;

  const listItemTap = (e: TapGestureEventData) => {
    /**
     * Handle tap events on list items
     * @param {object} e - the event arguments
     */
    e.object.get("text");
    console.log(`listItemTap: ${e.object.get("text")}`);
    feedbackMessage = e.object.get("text");
  };
</script>

<page>
  <actionBar title="Home" />

  <stackLayout>
    <label class="my-4 text-center text-md" text={feedbackMessage} />

    <listView
      class="list-group"
      separatorColor="transparent"
      items={features}
      itemTemplateSelector={selectListItemTemplate}
    >
      <Template key="odd" let:item>
        <label
          on:tap={listItemTap}
          class="bg-white p-4 text-lg"
          text={item.properties.title}
        />
      </Template>
      <Template key="even" let:item>
        <label
          on:tap={listItemTap}
          class="bg-slate-200 p-4 text-lg"
          text={item.properties.title}
        />
      </Template>
    </listView>
  </stackLayout>
  <!-- <webView src="https://nativescript.org/" /> -->
</page>

<style>
</style>
