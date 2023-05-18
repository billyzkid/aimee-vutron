import { test, expect } from "vitest";
import { config, mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { createRouter, createWebHashHistory } from "vue-router";
import { createI18n } from "vue-i18n";
import { createVuetify } from "vuetify";
import { VApp } from "vuetify/components";

import App from "../src/renderer/components/App.vue";
import MainScreen from "../src/renderer/components/screens/MainScreen.vue";
import SecondScreen from "../src/renderer/components/screens/SecondScreen.vue";
import DefaultLayout from "../src/renderer/components/layout/DefaultLayout.vue";
import HeaderLayout from "../src/renderer/components/layout/HeaderLayout.vue";

const pinia = createPinia();
const router = createRouter({
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
const i18n = createI18n({ legacy: false });
const vuetify = createVuetify();

config.global.plugins = [pinia, router, i18n, vuetify];
config.global.mocks.$t = (key: string) => key;

function mount2(parent: any, child: any) {
  return mount(parent, {
    slots: {
      default: child
    }
  });
}

test("App component", () => {
  const wrapper = mount(App);
  expect(wrapper.exists()).toBe(true);
});

test("MainScreen component", () => {
  const wrapper = mount2(VApp, MainScreen);
  expect(wrapper.exists()).toBe(true);
});

test("SecondScreen component", () => {
  const wrapper = mount2(VApp, SecondScreen);
  expect(wrapper.exists()).toBe(true);
});

test("DefaultLayout component", () => {
  const wrapper = mount2(VApp, DefaultLayout);
  expect(wrapper.exists()).toBe(true);
});

test("HeaderLayout component", () => {
  const wrapper = mount2(VApp, HeaderLayout);
  expect(wrapper.exists()).toBe(true);
});
