import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/renderer/components/App.vue";
import i18n from "@/renderer/plugins/i18n";
import router from "@/renderer/plugins/router";
import vuetify from "@/renderer/plugins/vuetify";

const app = createApp(App);

app.use(createPinia()).use(i18n).use(router).use(vuetify);
app.mount("#app");
