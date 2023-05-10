import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/renderer/router";
import vuetify from "@/renderer/plugins/vuetify";
import i18n from "@/renderer/plugins/i18n";
import App from "@/renderer/App.vue";

const app = createApp(App);

app.use(createPinia()).use(router).use(vuetify).use(i18n);
app.mount("#app");
