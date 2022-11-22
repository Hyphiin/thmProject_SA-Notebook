<template>
  <q-tabs v-model="tab" align="center" class="text-primary q-mt-sm q-mb-lg">
    <q-tab name="DSOne" label="DS One" />
    <q-tab name="DSTwo" label="DS Two" />
    <q-tab name="DSThree" label="DS Three" />
  </q-tabs>
  <div align="center" class="q-ma-xl">
    <q-btn
      to="/add-recipe"
      icon="add"
      label="NEW RECIPE"
      stack
      color="secondary"
    />
  </div>
  <div class="q-mx-xl">
    <DSOneTab v-if="tab === 'DSOne'" />
    <DSTwoTab v-if="tab === 'DSTwo'" />
    <DSThreeTab v-if="tab === 'DSThree'" />
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref } from "vue";
import DSOneTab from "../pages/DSOneTab";
import DSTwoTab from "../pages/DSTwoTab";
import DSThreeTab from "../pages/DSThreeTab";

/**
 * Tabs
 */
const tab = ref("DSOne");
</script>
