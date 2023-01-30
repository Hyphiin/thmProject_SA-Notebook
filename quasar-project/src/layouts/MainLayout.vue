<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-secondary text-primary" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="flex items-center">
          <q-icon
            name="menu_book"
            color="primary"
            size="3rem"
            class="q-mr-md"
          />
          Speech To Text Tester
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
