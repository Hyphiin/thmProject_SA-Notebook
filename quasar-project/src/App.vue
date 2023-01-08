<template>
  <router-view />
</template>

<script setup>
/**
 * imports
 */
import { onMounted } from "vue";
import { useStoreRecipes_STT1 } from "src/stores/storeRecipes_STT1";
import { useStoreRecipes_STT2 } from "src/stores/storeRecipes_STT2";
import { useStoreRecipes_STT3 } from "src/stores/storeRecipes_STT3";

/**
 * store
 */
const storeRecipes_STT1 = useStoreRecipes_STT1();
const storeRecipes_STT2 = useStoreRecipes_STT2();
const storeRecipes_STT3 = useStoreRecipes_STT3();

/**
 * mounted
 */
onMounted(() => {
  storeRecipes_STT1.getRecipes();
  storeRecipes_STT2.getRecipes();
  storeRecipes_STT3.getRecipes();
});
</script>
