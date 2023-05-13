import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./components/App.vue";
import i18n from "./plugins/i18n";
import router from "./plugins/router";
import vuetify from "./plugins/vuetify";

const app = createApp(App);

app.use(createPinia()).use(i18n).use(router).use(vuetify);
app.mount("#app");
