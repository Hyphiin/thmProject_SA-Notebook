<template>
  <div
    v-for="recipe in currentStore.recipes"
    :key="recipe.id"
    class="q-mx-md q-my-sm"
  >
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ recipe.title }}</div>
        <div class="text-subtitle2">{{ recipe.servings }} Personen</div>
      </q-card-section>

      <q-card-section>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod non error
        accusantium voluptatibus iusto similique magnam,
      </q-card-section>

      <q-separator dark />

      <q-card-actions class="justify-end">
        <q-btn outline color="primary">OPEN</q-btn>
        <q-btn outline color="red">DELETE</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { onMounted, watch, ref } from "vue";

import { useStoreRecipesDS1 } from "src/stores/storeRecipesDS1";
import { useStoreRecipesDS2 } from "src/stores/storeRecipesDS2";
import { useStoreRecipesDS3 } from "src/stores/storeRecipesDS3";

/**
 * props
 */
const props = defineProps({
  storeToUse: {
    type: String,
    default: "DS1",
  },
});

/**
 * store
 */
let currentStore = useStoreRecipesDS1();

watch(
  () => currentStore,
  () => {
    if (props.storeToUse === "DS2") {
      currentStore = currentStore = useStoreRecipesDS2();
    } else if (props.storeToUse === "DS3") {
      currentStore = currentStore = useStoreRecipesDS3();
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
.my-card {
  min-width: 250px;
  width: 250px;
  max-width: 250px;
  min-height: 280px;
  height: 280px;
  max-height: 280px;
}
</style>
