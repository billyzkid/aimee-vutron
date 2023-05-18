import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHashHistory } from "vue-router";

import { createI18n, useI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

import { createVuetify } from "vuetify";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import colors from "vuetify/lib/util/colors";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.min.css";

import App from "./components/App.vue";
import MainScreen from "./components/screens/MainScreen.vue";
import SecondScreen from "./components/screens/SecondScreen.vue";

declare global {
  interface Window {
    mainApi: MainApi;
  }
}

const pinia = createPinia();

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/main"
    },
    {
      path: "/main",
      name: "main-screen",
      component: MainScreen
    },
    {
      path: "/second",
      name: "second-screen",
      component: SecondScreen
    }
  ]
});

const i18n = createI18n({
  legacy: false,
  fallbackLocale: "en",
  messages
});

const locale = await window.mainApi.getLocale();
const shortLocale = locale.split("-")[0];

// Initialize the locale
if (i18n.global.availableLocales.includes(locale)) {
  i18n.global.locale.value = locale;
} else if (i18n.global.availableLocales.includes(shortLocale)) {
  i18n.global.locale.value = shortLocale;
} else {
  i18n.global.locale.value = String(i18n.global.fallbackLocale.value);
}

const vuetify = createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n })
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: "dark",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.green.darken2
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: colors.green.darken4
        }
      }
    }
  }
});

const app = createApp(App).use(pinia).use(router).use(i18n).use(vuetify);
app.mount("#app");
