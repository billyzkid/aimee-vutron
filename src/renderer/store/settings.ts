import { defineStore } from "pinia";
import i18n from "../plugins/i18n";
import vuetify from "../plugins/vuetify";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    theme: "dark",
    language: "en"
  }),
  getters: {
    getTheme: (state) => state.theme,
    getLanguage: (state) => state.language
  },
  actions: {
    toggleTheme() {
      this.theme = vuetify.theme.global.name.value = vuetify.theme.current.value.dark ? "light" : "dark";
    },
    changeLanguage(locale: string) {
      this.language = i18n.global.locale.value = locale;
    }
  },
  persist: true
});
