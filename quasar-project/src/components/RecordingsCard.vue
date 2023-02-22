<template>
  <q-card class="my-card-rec">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">{{ recording.title }}</div>
    </q-card-section>

    <q-separator dark />

    <q-card-actions class="justify-end">
      <q-btn :to="`/show-recording/${recording.id}`" outline color="primary"
        >OPEN</q-btn
      >
      <q-btn outline color="red" @click="emit('deleteClicked', recordingId)"
        >DELETE</q-btn
      >
    </q-card-actions>
  </q-card>
</template>

<script setup>
/**
 * props
 */
const props = defineProps({
  recording: {
    type: Object,
    required: true,
  },
});

/**
 * emits
 */
const emit = defineEmits(["deleteClicked"]);
</script>

<style lang="scss">
.my-card-rec {
  min-width: 250px;
  width: 250px;
  max-width: 250px;
  min-height: 130px;
  height: 130px;
  max-height: 130px;
}
</style>
