import { defineStore } from "pinia";
// import { useTheme } from "vuetify";
// import { useI18n } from "vue-i18n";

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
      //const theme = useTheme();
      //theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
    },
    changeLanguage() {
      //const i18n = useI18n();
      //i18n.locale.value = language;
    }
  },
  persist: true
});
