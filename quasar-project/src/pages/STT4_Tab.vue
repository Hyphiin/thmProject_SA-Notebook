<template>
  <div class="flex flex-center">
    <div
      v-for="recipe in storeRecipes.recipes"
      :key="recipe.id"
      class="q-mx-md q-my-sm"
    >
      <RecipesCard
        :title="recipe.title"
        :servings="recipe.servings"
        :recipe-id="recipe.id"
        @delete-clicked="deleteRecipe"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * imports
 */
import RecipesCard from "../components/RecipesCard.vue";

import { useStoreRecipes_STT4 } from "src/stores/storeRecipes_STT4";

/**
 * store
 */
const storeRecipes = useStoreRecipes_STT4();

/**
 * delete recipe
 */
const deleteRecipe = (idToDelete) => {
  storeRecipes.deleteRecipe(idToDelete);
};
</script>
