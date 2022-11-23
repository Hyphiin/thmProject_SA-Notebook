import { defineStore } from "pinia";
import { ref } from "vue";

export const useStoreRecipesDS2 = defineStore("storeRecipesDS2", () => {
  const recipes = ref([
    {
      id: "id1",
      title: "Calzone",
      servings: 2,
    },
    {
      id: "id2",
      title: "Cabonara",
      servings: 4,
    },
  ]);

  /**
   * actions
   */
  const addRecipe = (newRecipeContent) => {
    let currentDate = new Date().getTime(),
      id = currentDate.toString();

    let recipe = {
      id,
      title: newRecipeContent.title,
      sevings: newRecipeContent.sevings,
    };
    recipes.value.unshift(recipe);
  };

  const deleteRecipe = (idToDelete) => {
    recipes.value = recipes.value.filter((recipe) => recipe.id !== idToDelete);
  };

  const updateRecipeTitle = (id, newTitle) => {
    let index = recipes.value.findIndex((recipe) => recipe.id === id);
    recipes.value[index].title = newTitle;
  };

  /**
   * getters
   */

  return {
    recipes,
    addRecipe,
    deleteRecipe,
    updateRecipeTitle,
  };
});
