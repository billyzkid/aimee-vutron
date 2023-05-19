<script setup lang="tsx">
  import DefaultLayout from "./layout/DefaultLayout.vue";
</script>

<template>
  <default-layout>
    <router-view />
  </default-layout>
</template>

<style>
  html {
    user-select: none;
    overflow-y: auto !important;
  }
</style>
