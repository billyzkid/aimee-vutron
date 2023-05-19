import { createRouter, createWebHashHistory } from "vue-router";
import MainScreen from "../components/screens/MainScreen.vue";
import SecondScreen from "../components/screens/SecondScreen.vue";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/main"
    },
    {
      path: "/main",
      name: "main-screen",
      component: MainScreen
    },
    {
      path: "/second",
      name: "second-screen",
      component: SecondScreen
    }
  ]
});
