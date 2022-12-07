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
      <div class="bg-grey-3 q-pa-md">
        <div class="newIngredient flex">
          <q-input
            filled
            v-model="newIngredientName"
            label="Zutat"
            class="q-mr-sm"
            :error="displayErrorIngredients"
            error-message="Bitte ausfüllen"
          />
          <q-input
            filled
            v-model="newIngredientNumber"
            type="number"
            label="Anzahl"
            class="q-ml-sm"
            :error="displayErrorIngredients"
            error-message="Bitte ausfüllen"
          />
          <q-select
            filled
            v-model="newIngredientNumberType"
            :options="options"
            label=""
            class="q-ml-sm"
          />
          <q-btn
            class="q-ml-sm"
            label=""
            icon="add"
            color="primary"
            style="max-height: 56px"
            @click="addIngredient"
          />
        </div>
        <div class="addIngredient flex justify-center"></div>
        <p class="text-subtitle1 q-mt-lg">Zutaten:</p>
        <div
          v-for="(ingredient, idx) in allIngredients"
          :key="idx"
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
      </div>
      <div class="bg-grey-3 q-pa-md">
        <div class="newStep flex justify-between">
          <q-input
            filled
            type="textarea"
            v-model="newStep"
            :label="'Schritt ' + (allSteps.length + 1)"
            class="q-mr-sm"
            :error="displayErrorSteps"
            error-message="Bitte ausfüllen"
            style="min-width: 470px"
          />
          <q-btn
            label=""
            icon="add"
            color="primary"
            @click="addStep"
            style="max-height: 56px"
          />
        </div>
        <p class="text-subtitle1 q-mt-lg">Schritte:</p>
        <div
          v-for="(step, idx) in allSteps"
          :key="idx"
          class="flex flex-col justify-between"
        >
          <div>
            <span class="text-bold q-mr-md">{{ idx + 1 }}.</span>
            <span> {{ step }}</span>
          </div>

          <q-btn
            flat
            round
            color="primary"
            icon="delete"
            size="sm"
            @click="deleteStep(idx)"
          />
        </div>
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
 * recipe data
 */
const title = ref(null);
const servings = ref(null);
const prepTime = ref(null);
/**
 * ingredients data
 */
const newIngredientName = ref("");
const newIngredientNumber = ref("");
const newIngredientNumberType = ref("g");
const allIngredients = ref([]);

const addIngredient = () => {
  if (newIngredientName.value !== "" && newIngredientNumber.value !== "") {
    displayErrorIngredients.value = false;
    allIngredients.value.push({
      name: newIngredientName.value,
      number: newIngredientNumber.value,
      numberType: newIngredientNumberType.value,
    });
    newIngredientName.value = "";
    newIngredientNumber.value = "";
    newIngredientNumberType.value = "g";
  } else {
    displayErrorIngredients.value = true;
  }
};
const deleteIngredient = (idx) => {
  allIngredients.value.splice(idx, 1);
};
/**
 * steps data
 */
const newStep = ref("");
const allSteps = ref([]);

const addStep = () => {
  if (newStep.value !== "") {
    displayErrorStep.value = false;
    allSteps.value.push(newStep.value);
    newStep.value = "";
  } else {
    displayErrorStep.value = true;
  }
};
const deleteStep = (idx) => {
  allSteps.value.splice(idx, 1);
};

/**
 * helper vars
 */
const displayErrorIngredients = ref(false);
const displayErrorStep = ref(false);
const options = ref(["g", "kg", "ml", "l", "Stk", "Pkg"]);

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
      prepSteps: allSteps.value,
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

<style lang="scss">
.newStep {
}
</style>
