<template>
  <div class="flex flex-center">
    <AllSTT />
  </div>
</template>

<script setup>
/**
 * imports
 */
import RecordingsCard from "../components/RecordingsCard.vue";
import AllSTT from "../pages/AllSTT.vue";

import { useStoreAllRecordings } from "src/stores/storeAllRecordings.js";

/**
 * store
 */
const storeRecordings = useStoreAllRecordings();

/**
 * delete recording
 */
const deleteRecording = (idToDelete) => {
  storeRecordings.deleteRecording(idToDelete);
};
</script>
