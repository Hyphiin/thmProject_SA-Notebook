<template>
  <router-view />
</template>

<script setup>
/**
 * imports
 */
import { onMounted } from "vue";
import { useStoreRecipesDS1 } from "src/stores/storeRecipesDS1";
import { useStoreRecipesDS2 } from "src/stores/storeRecipesDS2";
import { useStoreRecipesDS3 } from "src/stores/storeRecipesDS3";

/**
 * store
 */
const storeRecipesDS1 = useStoreRecipesDS1();
const storeRecipesDS2 = useStoreRecipesDS2();
const storeRecipesDS3 = useStoreRecipesDS3();

/**
 * mounted
 */
onMounted(() => {
  storeRecipesDS1.getRecipes();
  storeRecipesDS2.getRecipes();
  storeRecipesDS3.getRecipes();
});
</script>
