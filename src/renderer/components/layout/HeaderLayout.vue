<script setup lang="tsx">
  import { useI18n } from "vue-i18n";
  import { useRoute } from "vue-router";
  import { computed } from "vue";

  const { t } = useI18n();
  const route = useRoute();
  const title = computed(() => (route.name !== undefined ? t(`${String(route.name)}.title`) : undefined));
</script>

<template>
  <v-app-bar color="primary" density="compact">
    <v-app-bar-title>{{ title }}</v-app-bar-title>
    <v-btn-toggle variant="text" rounded="0">
      <v-btn icon="mdi-home-floor-1" :to="{ name: 'main-screen' }" />
      <v-btn icon="mdi-home-floor-2" :to="{ name: 'second-screen' }" />
    </v-btn-toggle>
  </v-app-bar>
</template>

<style scoped>
  .v-btn {
    color: rgb(var(--v-theme-on-primary));
  }
</style>
