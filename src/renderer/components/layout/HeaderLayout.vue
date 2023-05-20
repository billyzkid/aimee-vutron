<script setup lang="tsx">
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  const route = useRoute();
  const routeTitleKey = computed(() => `${String(route.name ?? "main-screen")}.title`);
</script>

<template>
  <v-app-bar color="primary" density="compact">
    <v-app-bar-title>{{ $t(routeTitleKey) }}</v-app-bar-title>
    <v-btn-toggle variant="text" rounded="0" mandatory>
      <v-btn icon="mdi-home-floor-1" :to="{ name: 'main-screen' }" />
      <v-btn icon="mdi-home-floor-2" :to="{ name: 'second-screen' }" />
    </v-btn-toggle>
  </v-app-bar>
</template>
