import { defineStore } from "pinia";
import i18n from "../plugins/i18n";
import vuetify from "../plugins/vuetify";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    theme: "light",
    locale: "en"
  }),
  actions: {
    initialize() {
      vuetify.theme.global.name.value = this.theme;
      i18n.global.locale.value = this.locale;
    },
    toggleTheme() {
      this.theme = vuetify.theme.global.name.value = vuetify.theme.current.value.dark ? "light" : "dark";
    },
    changeLanguage(locale: string) {
      this.locale = i18n.global.locale.value = locale;
    }
  },
  persist: true
});
