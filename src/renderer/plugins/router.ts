import { createRouter, createWebHashHistory } from "vue-router";
import MainScreen from "@/renderer/components/screens/MainScreen.vue";
import SecondScreen from "@/renderer/components/screens/SecondScreen.vue";
import ErrorScreen from "@/renderer/components/screens/ErrorScreen.vue";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: MainScreen,
      meta: {
        titleKey: "title.main"
      }
    },
    {
      path: "/second",
      component: SecondScreen,
      meta: {
        titleKey: "title.second"
      }
    },
    {
      path: "/error",
      component: ErrorScreen,
      meta: {
        titleKey: "title.error"
      }
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/"
    }
  ]
});
