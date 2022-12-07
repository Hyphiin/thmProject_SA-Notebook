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
        label="Für wie viele Personen?"
        lazy-rules
        hint="Für wie viele Personen ist dieses Rezept?"
      />
      <q-input
        filled
        type="number"
        v-model="prepTime"
        label="Zubereitungszeit?"
        lazy-rules
        hint="Wie lange dauert es dieses Rezept zu kochen?"
      />
      <!-- <div class="newIngredient flex">
        <q-input filled v-model="prepTime" label="Zutat" class="q-mr-sm" />
        <q-input filled v-model="prepTime" label="Anzahl" class="q-ml-sm" />
      </div> -->
      <div class="addIngredient flex justify-center">
        <q-btn label="" icon="add" color="primary" />
      </div>
      <!-- <div v-for="ingredient in allIngredients" :key="ingredient.name">
        hallo
      </div> -->

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
import { toNamespacedPath } from "path";

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
const newIngredient = ref(null);
const allIngredients = ref(null);

/**
 * save in store
 */
const onSubmit = () => {
  console.log("hello");
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
