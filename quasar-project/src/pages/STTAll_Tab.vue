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
        :recording="recording"
        @delete-clicked="deleteRecording"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { onMounted } from "vue";
import RecordingsCard from "../components/RecordingsCard.vue";

import { useStoreAllRecordings } from "src/stores/storeAllRecordings.js";

/**
 * store
 */
const storeRecordings = useStoreAllRecordings();

onMounted(() => {
  storeRecordings.getRecordings();
});

/**
 * delete recording
 */
const deleteRecording = (idToDelete) => {
  storeRecordings.deleteRecording(idToDelete);
};
</script>
