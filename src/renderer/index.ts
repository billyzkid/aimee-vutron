import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./components/App.vue";
import i18n from "./plugins/i18n";
import router from "./plugins/router";
import vuetify from "./plugins/vuetify";

declare global {
  interface Window {
    mainApi: MainApi;
  }
}

const app = createApp(App).use(createPinia()).use(i18n).use(router).use(vuetify);
app.mount("#app");
