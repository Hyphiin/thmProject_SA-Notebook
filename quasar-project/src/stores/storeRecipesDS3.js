import { defineStore } from "pinia";
import { ref } from "vue";
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "/src/js/firebase";

const recipesCollectionRef = collection(db, "Dialogsystem3");
const recipesCollectionQuery = query(
  recipesCollectionRef,
  orderBy("date", "desc")
);

export const useStoreRecipesDS3 = defineStore("storeRecipesDS3", () => {
  const recipes = ref([]);

  /**
   * actions
   */
  const getRecipes = async () => {
    onSnapshot(recipesCollectionQuery, (querySnapshot) => {
      const tempRecipes = [];
      querySnapshot.forEach((doc) => {
        let recipe = {
          id: doc.id,
          date: doc.data().date,
          title: doc.data().title,
          sevings: doc.data().servings,
          prepTime: doc.data().prepTime,
          ingredients: doc.data().ingredients,
          prepSteps: doc.data().prepSteps,
        };
        tempRecipes.push(recipe);
      });
      recipes.value = tempRecipes;
    });
  };

  const addRecipe = async (newRecipeContent) => {
    let currentDate = new Date().getTime(),
      date = currentDate.toString();

    await addDoc(recipesCollectionRef, {
      date,
      title: newRecipeContent.title,
      sevings: newRecipeContent.servings,
      prepTime: newRecipeContent.prepTime,
      ingredients: newRecipeContent.ingredients,
      prepSteps: newRecipeContent.prepSteps,
    });
  };

  const deleteRecipe = async (idToDelete) => {
    await deleteDoc(doc(recipesCollectionRef, idToDelete));
  };

  /**
   * getters
   */

  return {
    recipes,
    getRecipes,
    addRecipe,
    deleteRecipe,
  };
});
