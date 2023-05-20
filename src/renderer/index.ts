import { createApp } from "vue";
import { i18n, pinia, router, vuetify } from "./plugins";
import { useSettingsStore } from "./store/settings";
import App from "./components/App.vue";

import "@mdi/font/css/materialdesignicons.min.css";
import "vuetify/styles";

declare global {
  interface Window {
    mainApi: MainApi;
  }
}

const app = createApp(App);

app.use(i18n);
app.use(pinia);
app.use(router);
app.use(vuetify);

const settingsStore = useSettingsStore();
settingsStore.initialize();

app.mount("#app");
