<template>
  <q-tabs v-model="tab" align="center" class="text-primary q-mt-sm q-mb-lg">
    <q-tab name="STT_All" label="All Frameworks" />
    <q-tab name="STT1" label="STT One" />
    <q-tab name="STT2" label="STT Two" />
    <q-tab name="STT3" label="STT Three" />
  </q-tabs>
  <div align="center" class="q-ma-xl">
    <q-btn
      :to="recipePageLink"
      icon="add"
      label="NEW RECIPE"
      stack
      color="accent"
    />
  </div>
  <div class="q-mx-xl">
    <!-- <STTAll_Tab v-if="tab === 'STT_All'" /> -->
    <STT1Tab v-if="tab === 'STT1'" />
    <STT2Tab v-if="tab === 'STT2'" />
    <STT3Tab v-if="tab === 'STT3'" />
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref, watch } from "vue";
// import STTAll_Tab from "../pages/AllSTT_Tab";
import STT1Tab from "../pages/STT1_Tab";
import STT2Tab from "../pages/STT2_Tab";
import STT3Tab from "../pages/STT3_Tab";

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
    } else if (newValue === "STT2") {
      recipePageLink.value = "/add-recipe-STT2";
      // } else if (newValue === "STT3") {
      //   recipePageLink.value = "/add-recipe-_STT3";
    } else if (newValue === "STT_All") {
      recipePageLink.value = "/add-recipe-STT_All";
    }
  }
);
</script>
