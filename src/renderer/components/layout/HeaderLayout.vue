<script setup lang="tsx">
  import { computed } from "vue";
  import { useRoute, useRouter } from "vue-router";

  const route = useRoute();
  const router = useRouter();
  const titleKey = computed(getTitleKey);

  function getTitleKey() {
    const routeName = (route.name ?? "main-screen") as string;
    return `${routeName}.title`;
  }

  function isCurrentRoute(name: string) {
    return route.name === name;
  }

  function handleChangeRoute(name: string) {
    router.push({ name });
  }
</script>

<template>
  <v-app-bar color="primary" density="compact">
    <v-app-bar-title>{{ $t(titleKey) }}</v-app-bar-title>
    <v-btn
      variant="text"
      prepend-icon="mdi-home-floor-1"
      :class="{ active: isCurrentRoute('main-screen') }"
      @click="handleChangeRoute('main-screen')">
      {{ $t("main-screen.title") }}
    </v-btn>
    <v-btn
      variant="text"
      prepend-icon="mdi-home-floor-2"
      :class="{ active: isCurrentRoute('second-screen') }"
      @click="handleChangeRoute('second-screen')">
      {{ $t("second-screen.title") }}
    </v-btn>
  </v-app-bar>
</template>

<style scoped>
  .v-btn {
    opacity: 0.4;
  }
  .active {
    opacity: 1 !important;
  }
</style>
