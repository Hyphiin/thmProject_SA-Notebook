<template>
  <div v-for="i in 10" :key="i" class="q-mx-md q-my-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Our Changing Planet</div>
        <div class="text-subtitle2">by John Doe</div>
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
  </div>
</template>

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
