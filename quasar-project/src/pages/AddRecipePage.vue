<template>
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
import { useStoreRecipesDS2 } from "src/stores/storeRecipesDS2";
import { useStoreRecipesDS3 } from "src/stores/storeRecipesDS3";

/**
 * store
 */
const storeRecipesDS1 = useStoreRecipesDS1();
const storeRecipesDS2 = useStoreRecipesDS2();
const storeRecipesDS3 = useStoreRecipesDS3();

/**
 * data to save
 */
const title = ref(null);
const servings = ref(null);

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
    storeRecipesDS1.addRecipe({ title: title.value, servings: servings.value });
    storeRecipesDS2.addRecipe({ title: title.value, servings: servings.value });
    storeRecipesDS3.addRecipe({ title: title.value, servings: servings.value });
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
