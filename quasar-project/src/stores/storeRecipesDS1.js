import { defineStore } from "pinia";
import { ref } from "vue";

export const useStoreRecipesDS1 = defineStore("storeRecipesDS1", () => {
  const recipes = ref([
    {
      id: "id1",
      title: "Spaghetti",
      servings: 4,
      prepTime: "40min",
      ingredients: [
        { name: "Nudeln", number: "500", numberType: "g" },
        { name: "Olivenöl", number: "50", numberType: "ml" },
        { name: "Tomaten", number: "4", numberType: "Stk" },
      ],
      prepSteps: [
        "Lorem Ipsum ndjscbdao udhasuih adoi asd asdio aso",
        "foiadshfoashoh asdasod hasohdoi ashdoi",
        "fisofchasohf ahsfo",
        "asofashd adoihasoid hasiod osahdo ashodi ashodh soidh oashd osadohaohaosd h",
      ],
    },
    {
      id: "id2",
      title: "Lasagne",
      servings: 6,
      prepTime: "40min",
      ingredients: [
        { name: "Nudeln", number: "500", numberType: "g" },
        { name: "Olivenöl", number: "50", numberType: "ml" },
        { name: "Tomaten", number: "4", numberType: "Stk" },
      ],
      prepSteps: [
        "Lorem Ipsum ndjscbdao udhasuih adoi asd asdio aso",
        "foiadshfoashoh asdasod hasohdoi ashdoi",
        "fisofchasohf ahsfo",
        "asofashd adoihasoid hasiod osahdo ashodi ashodh soidh oashd osadohaohaosd h",
      ],
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
      sevings: newRecipeContent.servings,
      prepTime: newRecipeContent.prepTime,
      ingredients: newRecipeContent.ingredients,
      prepSteps: newRecipeContent.prepSteps,
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
