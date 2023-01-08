<template>
  <div class="flex flex-center">
    <div
      v-for="recipe in storeRecipes.recipes"
      :key="recipe.id"
      class="q-mx-md q-my-sm"
    >
      <RecipesCard :title="recipe.title" :servings="recipe.servings" />
    </div>
  </div>
</template>

<script setup>
/**
 * imports
 */
import RecipesCard from "../components/RecipesCard.vue";

import { useStoreRecipes_STT2 } from "src/stores/storeRecipes_STT2";

/**
 * store
 */
const storeRecipes = useStoreRecipes_STT2();
</script>
