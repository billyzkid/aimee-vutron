import { createRouter, createWebHashHistory } from "vue-router";
import MainScreen from "../components/screens/MainScreen.vue";
import SecondScreen from "../components/screens/SecondScreen.vue";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: MainScreen,
      meta: {
        titleKey: "main-screen.title"
      }
    },
    {
      path: "/second",
      component: SecondScreen,
      meta: {
        titleKey: "second-screen.title"
      }
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/"
    }
  ]
});
