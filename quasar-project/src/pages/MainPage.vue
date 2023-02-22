<template>
  <q-tabs v-model="tab" align="center" class="text-primary q-mt-sm q-mb-lg">
    <q-tab name="STTAll" label="All Frameworks" />
    <q-tab name="STT1" label="Web Speech API" />
    <q-tab name="STT2" label="Artyom.js" />
    <q-tab name="STT3" label="Assembly.ai" />
    <q-tab name="STT4" label="Deepspeech" />
  </q-tabs>
  <div align="center" class="q-ma-xl">
    <q-btn
      v-if="tab !== 'STTAll'"
      :to="recipePageLink"
      icon="add"
      label="NEW RECIPE"
      stack
      color="accent"
    />
  </div>
  <div class="q-mx-xl">
    <AllSTT v-if="tab === 'STTAll'" />
    <STT1Tab v-if="tab === 'STT1'" />
    <STT2Tab v-if="tab === 'STT2'" />
    <STT3Tab v-if="tab === 'STT3'" />
    <STT4Tab v-if="tab === 'STT4'" />
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref, watch } from "vue";
import AllSTT from "../pages/AllSTT";
import STT1Tab from "../pages/STT1_Tab";
import STT2Tab from "../pages/STT2_Tab";
import STT3Tab from "../pages/STT3_Tab";
import STT4Tab from "../pages/STT4_Tab";

import { useStoreGeneral } from "src/stores/generalStore";

/**
 * Stores
 */
const generalStore = useStoreGeneral();

/**
 * Tabs
 */
const tab = ref("STT1");

/**
 * Recipe Page
 */
const recipePageLink = ref("/add-recipe-STT1");

watch(
  () => tab.value,
  (newValue) => {
    console.log(newValue);
    if (newValue === "STT1") {
      recipePageLink.value = "/add-recipe-STT1";
      generalStore.changeActiveStore("SpeechToText1");
    } else if (newValue === "STT2") {
      recipePageLink.value = "/add-recipe-STT2";
      generalStore.changeActiveStore("SpeechToText2");
    } else if (newValue === "STT3") {
      recipePageLink.value = "/add-recipe-STT3";
      generalStore.changeActiveStore("SpeechToText3");
    } else if (newValue === "STT4") {
      recipePageLink.value = "/add-recipe-STT4";
      generalStore.changeActiveStore("SpeechToText4");
    } else if (newValue === "STTAll") {
      recipePageLink.value = "/all-STT";
      generalStore.changeActiveStore("AllStores");
    }
  }
);
</script>
