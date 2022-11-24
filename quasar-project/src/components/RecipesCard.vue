<template>
  <q-card class="my-card">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">{{ title }}</div>
      <div class="text-subtitle2">{{ servings }} Personen</div>
    </q-card-section>

    <q-card-section>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod non error
      accusantium voluptatibus iusto similique magnam,
    </q-card-section>

    <q-separator dark />

    <q-card-actions class="justify-end">
      <q-btn outline color="primary">OPEN</q-btn>
      <q-btn outline color="red">DELETE</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
/**
 * imports
 */
import { number } from "@intlify/core-base";

/**
 * props
 */
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  servings: {
    type: Number,
    default: 2,
  },
});
</script>

<style lang="scss">
.my-card {
  min-width: 250px;
  width: 250px;
  max-width: 250px;
  min-height: 280px;
  height: 280px;
  max-height: 280px;
}
</style>
