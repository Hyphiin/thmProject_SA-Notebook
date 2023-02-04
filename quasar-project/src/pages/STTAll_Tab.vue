<template>
  <div class="flex flex-center">
    <div
      v-for="recording in storeRecordings.recordings"
      :key="recording.id"
      class="q-mx-md q-my-sm"
    >
      <RecordingsCard
        flat
        class="bg-secondary"
        :title="recording.title"
        :recipe-id="recording.id"
        @delete-clicked="deleteRecording"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * imports
 */
import RecordingsCard from "../components/RecordingsCard.vue";

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
