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

import { useStoreRecipesDS2 } from "src/stores/storeRecipesDS2";

/**
 * store
 */
const storeRecipes = useStoreRecipesDS2();
</script>
