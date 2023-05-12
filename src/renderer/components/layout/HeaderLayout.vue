<script setup lang="tsx">
  import { useRouter, useRoute } from "vue-router";

  const router = useRouter();
  const route = useRoute();
  const titleKey = (route?.meta?.titleKey || "title.main") as string;

  function handleRoute(path: string) {
    router.push(path);
  }

  function isCurrentRoute(path: string) {
    return path === route.path;
  }
</script>

<template>
  <v-app-bar color="primary" density="compact">
    <v-app-bar-title>{{ $t(titleKey) }}</v-app-bar-title>
    <template #append>
      <v-btn prepend-icon="mdi-home" variant="text" :class="{ active: isCurrentRoute('/') }" @click="handleRoute('/')">
        {{ $t("title.main") }}
      </v-btn>
      <v-btn
        prepend-icon="mdi-fit-to-screen-outline"
        variant="text"
        :class="{ active: isCurrentRoute('/second') }"
        @click="handleRoute('/second')"
      >
        {{ $t("title.second") }}
      </v-btn>
    </template>
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
