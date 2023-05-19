<script setup lang="tsx">
  import { useCounterStore } from "../../store/counter";
  import { useSettingsStore } from "../../store/settings";

  const counterStore = useCounterStore();
  const settingsStore = useSettingsStore();
  const appVersion = import.meta.env.VITE_APP_VERSION;

  function openDocumentation() {
    window.mainApi.openExternalUrl("https://vutron.jooy2.com");
  }

  function openSourceCode() {
    window.mainApi.openExternalUrl("https://github.com/jooy2/vutron");
  }
</script>

<template>
  <v-container>
    <v-row no-gutters class="text-center">
      <v-col cols="12" md="5">
        <img src="/images/vutron-logo.webp" alt="logo" draggable="false" class="w-75" />
      </v-col>
      <v-col cols="12" md="7">
        <h2 class="my-4">{{ $t("main-screen.greeting") }}</h2>
        <p class="my-4">{{ $t("main-screen.description") }}</p>
        <p class="my-4">{{ $t("main-screen.version", [appVersion]) }}</p>
        <v-row class="my-4">
          <v-col>
            <v-btn icon color="primary" @click="settingsStore.toggleTheme">
              <v-icon icon="mdi-brightness-6" />
              <v-tooltip activator="parent" location="bottom">
                {{ $t("main-screen.menu.change-theme") }}
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col>
            <v-badge color="blue" :content="counterStore.count">
              <v-btn icon color="primary" @click="counterStore.incrementCount">
                <v-icon icon="mdi-plus-circle" />
                <v-tooltip activator="parent" location="bottom">
                  {{ $t("main-screen.menu.increment-count") }}
                </v-tooltip>
              </v-btn>
            </v-badge>
          </v-col>
          <v-col>
            <v-btn icon color="primary" @click="openDocumentation">
              <v-icon icon="mdi-file-document" />
              <v-tooltip activator="parent" location="bottom">
                {{ $t("main-screen.menu.documentation") }}
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn icon color="primary" @click="openSourceCode">
              <v-icon icon="mdi-github" />
              <v-tooltip activator="parent" location="bottom">
                {{ $t("main-screen.menu.source-code") }}
              </v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="my-4">
          <v-col>
            <v-select
              density="compact"
              :label="$t('main-screen.menu.change-language')"
              :items="$i18n.availableLocales"
              :model-value="settingsStore.language"
              @update:model-value="settingsStore.changeLanguage" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
