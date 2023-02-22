<template>
  <q-card class="my-card">
    <q-img src="../assets/Pizza.jpg">
      <div class="absolute-bottom">
        <div class="text-h6">{{ title }}</div>
        <div class="text-subtitle2">{{ servings }} || {{ time }}</div>
      </div>
    </q-img>

    <q-separator dark />

    <q-card-actions class="justify-end">
      <q-btn :to="`/show-recipe/${recipeId}`" outline color="primary"
        >OPEN</q-btn
      >
      <q-btn outline color="red" @click="emit('deleteClicked', recipeId)"
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
  title: {
    type: String,
    required: true,
  },
  servings: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  recipeId: {
    type: Number,
    required: true,
  },
});

/**
 * emits
 */
const emit = defineEmits(["deleteClicked"]);
</script>

<style lang="scss">
.my-card {
  min-width: 250px;
  width: 250px;
  max-width: 250px;
  min-height: 220px;
  height: 220px;
  max-height: 220px;
  .q-img {
    max-height: 160px;
  }
}
</style>
