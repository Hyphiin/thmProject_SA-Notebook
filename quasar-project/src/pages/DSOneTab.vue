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

import { useStoreRecipesDS1 } from "src/stores/storeRecipesDS1";

/**
 * store
 */
const storeRecipes = useStoreRecipesDS1();
</script>
