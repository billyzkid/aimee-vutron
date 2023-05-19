<script setup lang="tsx">
  import HeaderLayout from "./HeaderLayout.vue";
</script>

<template>
  <v-app>
    <v-layout>
      <header-layout />
      <v-main>
        <slot />
      </v-main>
    </v-layout>
  </v-app>
</template>
