<script setup lang="tsx">
  import { useI18n } from "vue-i18n";
  import { useTheme } from "vuetify";
  import { useCounter } from "../../store/counter";
  import { storeToRefs } from "pinia";
  import { ref } from "vue";

  const { locale, availableLocales } = useI18n();
  const theme = useTheme();
  const counter = useCounter();

  const { count } = storeToRefs(counter);
  const language = ref(locale);
  const availableLanguages = ref(availableLocales);
  const appVersion = ref(import.meta.env.VITE_APP_VERSION);

  function handleChangeLanguage(value: string) {
    language.value = value;
  }

  function handleChangeTheme() {
    theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  }

  function handleIncreaseCount() {
    counter.increaseCount(1);
  }

  function handleOpenDocument() {
    window.mainApi.openExternalUrl("https://vutron.jooy2.com");
  }

  function handleOpenGitHub() {
    window.mainApi.openExternalUrl("https://github.com/jooy2/vutron");
  }
</script>

<template>
  <v-container>
    <v-row no-gutters align="center" class="text-center">
      <v-col cols="12" md="5">
        <img alt="logo" draggable="false" class="ma-auto h-auto w-75" src="/images/vutron-logo.webp" />
      </v-col>
      <v-col cols="12" md="7">
        <h2 class="my-4">{{ $t("desc.welcome-title") }}</h2>
        <p>{{ $t("desc.welcome-desc") }}</p>
        <p class="my-4">{{ $t("desc.app-version", [appVersion]) }}</p>
        <v-row class="my-4">
          <v-col cols="3">
            <v-btn icon color="primary" @click="handleChangeTheme">
              <v-icon icon="mdi-brightness-6" />
              <v-tooltip activator="parent" location="bottom">
                {{ $t("menu.change-theme") }}
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-badge color="blue" :content="count">
              <v-btn icon color="primary" @click="handleIncreaseCount">
                <v-icon icon="mdi-plus-circle" />
                <v-tooltip activator="parent" location="bottom">
                  {{ $t("menu.increase-count") }}
                </v-tooltip>
              </v-btn>
            </v-badge>
          </v-col>
          <v-col cols="3">
            <v-btn icon color="primary" @click="handleOpenDocument">
              <v-icon icon="mdi-file-document" />
              <v-tooltip activator="parent" location="bottom">
                {{ $t("menu.documentation") }}
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn icon color="primary" @click="handleOpenGitHub">
              <v-icon icon="mdi-github" />
              <v-tooltip activator="parent" location="bottom">
                {{ $t("menu.github") }}
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-select
              density="compact"
              :label="$t('menu.change-language')"
              :model-value="language"
              :items="availableLanguages"
              @update:model-value="handleChangeLanguage">
              {{ $t("menu.change-language") }}
            </v-select>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
