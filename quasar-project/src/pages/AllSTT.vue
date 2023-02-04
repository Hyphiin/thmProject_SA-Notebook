<template>
  <q-btn class="q-ma-md" to="/">Abbrechen</q-btn>
  <div class="flex justify-center q-pa-md"></div>
</template>

<script setup>
/**
 * imports
 */
import { ref } from "vue";
import { Notify } from "quasar";
import { useRouter } from "vue-router";
import { useStoreAllRecordings } from "src/stores/storeAllRecordings";

/**
 * router
 */
const router = useRouter();

/**
 * store
 */
const storeRecordings = useStoreAllRecordings();

/**
 * recipe data
 */
const recordingData = ref("");

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
    storeRecordings.addRecordings({
      recordingData,
    });

    Notify.create({
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
      position: "top",
      message: `Rezept '${title.value}' wurde gespeichert!`,
    });
    router.back();
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
