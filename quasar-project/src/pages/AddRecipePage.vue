<template>
  <q-btn class="q-ma-md" to="/">Abbrechen</q-btn>
  <div class="flex justify-center q-pa-md">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="title"
        label="Titel des Rezeptes"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Bitte trage einen Titel ein',
        ]"
      />

      <q-input
        filled
        type="number"
        v-model="servings"
        label="Für wie viele Personen"
        lazy-rules
        hint="Für wie viele Personen ist dieses Rezept?"
      />

      <q-input
        filled
        type="number"
        v-model="prepTime"
        label="Zubereitungszeit in Minuten"
        lazy-rules
        hint="Wie lange dauert es dieses Rezept zu kochen?"
      />
      <div class="newIngredient flex">
        <q-input
          filled
          v-model="newIngredientName"
          label="Zutat"
          class="q-mr-sm"
          :error="displayError"
          error-message="Bitte ausfüllen"
        />
        <q-input
          filled
          v-model="newIngredientNumber"
          type="number"
          label="Anzahl"
          class="q-ml-sm"
          :error="displayError"
          error-message="Bitte ausfüllen"
        />
        <q-select
          filled
          v-model="newIngredientNumberType"
          :options="options"
          label=""
          class="q-ml-sm"
        />
      </div>
      <div class="addIngredient flex justify-center">
        <q-btn label="" icon="add" color="primary" @click="addIngredient" />
      </div>
      Zutaten:
      <div
        v-for="(ingredient, idx) in allIngredients"
        :key="ingredient.name"
        class="flex flex-col justify-between"
      >
        <div>
          <span class="text-bold q-mr-md"
            >{{ ingredient.number }} {{ ingredient.numberType }}</span
          >
          <span> {{ ingredient.name }}</span>
        </div>

        <q-btn
          flat
          round
          color="primary"
          icon="delete"
          size="sm"
          @click="deleteIngredient(idx)"
        />
      </div>

      <div>
        <q-btn label="Speichern" type="submit" color="primary" />
        <q-btn
          label="Zurücksetzen"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref } from "vue";
import { Notify } from "quasar";
import { useStoreRecipesDS1 } from "src/stores/storeRecipesDS1";

/**
 * store
 */
const storeRecipesDS1 = useStoreRecipesDS1();

/**
 * data to save
 */
const title = ref(null);
const servings = ref(null);
const prepTime = ref(null);
const newIngredientName = ref("");
const newIngredientNumber = ref("");
const newIngredientNumberType = ref("g");
const allIngredients = ref([]);

/**
 * helper vars
 */
const displayError = ref(false);
const options = ref(["g", "kg", "ml", "l", "Stk", "Pkg"]);

/**
 * add ingredient Btn
 */
const addIngredient = () => {
  if (newIngredientName.value !== "" && newIngredientNumber.value !== "") {
    displayError.value = false;
    allIngredients.value.push({
      name: newIngredientName.value,
      number: newIngredientNumber.value,
      numberType: newIngredientNumberType.value,
    });
    newIngredientName.value = "";
    newIngredientNumber.value = "";
    newIngredientNumberType.value = "g";
  } else {
    displayError.value = true;
  }
};
const deleteIngredient = (idx) => {
  allIngredients.value.splice(idx, 1);
};

/**
 * save in store
 */
const onSubmit = () => {
  if (title.value === null) {
    Notify.create({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      position: "top",
      message: "Das Rezept braucht mindestens einen Titel",
    });
  } else {
    storeRecipesDS1.addRecipe({
      title: title.value,
      servings: servings.value,
      prepTime: prepTime.value,
      ingredients: allIngredients.value,
    });
    Notify.create({
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
      position: "top",
      message: `Rezept '${title.value}' wurde gespeichert!`,
    });
  }
};

/**
 * reset all
 */
const onReset = () => {
  title.value = null;
  servings.value = null;
};
</script>
