<script setup lang="tsx">
  import DefaultLayout from "./layout/DefaultLayout.vue";
</script>

<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>

<style>
  html {
    user-select: none;
    overflow-y: auto !important;
  }
</style>
