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

  function handleIncrementCount() {
    counter.incrementCount();
  }

  function handleOpenDocumentation() {
    window.mainApi.openExternalUrl("https://vutron.jooy2.com");
  }

  function handleOpenSourceCode() {
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
        <h2 class="my-4">{{ $t("main-screen.greeting") }}</h2>
        <p>{{ $t("main-screen.description") }}</p>
        <p class="my-4">{{ $t("main-screen.version", [appVersion]) }}</p>
        <v-row class="my-4">
          <v-col cols="3">
            <v-btn icon color="primary" @click="handleChangeTheme">
              <v-icon icon="mdi-brightness-6" />
              <v-tooltip activator="parent" location="bottom">
                {{ $t("main-screen.menu.change-theme") }}
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-badge color="blue" :content="count">
              <v-btn icon color="primary" @click="handleIncrementCount">
                <v-icon icon="mdi-plus-circle" />
                <v-tooltip activator="parent" location="bottom">
                  {{ $t("main-screen.menu.increment-count") }}
                </v-tooltip>
              </v-btn>
            </v-badge>
          </v-col>
          <v-col cols="3">
            <v-btn icon color="primary" @click="handleOpenDocumentation">
              <v-icon icon="mdi-file-document" />
              <v-tooltip activator="parent" location="bottom">
                {{ $t("main-screen.menu.documentation") }}
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn icon color="primary" @click="handleOpenSourceCode">
              <v-icon icon="mdi-github" />
              <v-tooltip activator="parent" location="bottom">
                {{ $t("main-screen.menu.source-code") }}
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-select
              density="compact"
              :label="$t('main-screen.menu.change-language')"
              :model-value="language"
              :items="availableLanguages"
              @update:model-value="handleChangeLanguage">
              {{ $t("main-screen.menu.change-language") }}
            </v-select>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
