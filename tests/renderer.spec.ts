import { test, expect } from "vitest";
import { config, mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { createRouter, createWebHashHistory } from "vue-router";
import { createI18n } from "vue-i18n";
import { createVuetify } from "vuetify";

import App from "../src/renderer/components/App.vue";
import MainScreen from "../src/renderer/components/screens/MainScreen.vue";
import SecondScreen from "../src/renderer/components/screens/SecondScreen.vue";
import DefaultLayout from "../src/renderer/components/layout/DefaultLayout.vue";
import HeaderLayout from "../src/renderer/components/layout/HeaderLayout.vue";

const pinia = createPinia();
const router = createRouter({ history: createWebHashHistory(), routes: [] });
const i18n = createI18n({ legacy: false });
const vuetify = createVuetify();

config.global.plugins = [pinia, router, i18n, vuetify];
config.global.mocks.$t = (key: string) => key;

test("App component", () => {
  const wrapper = mount(App);
  expect(wrapper.exists()).toBe(true);
});

test("MainScreen component", () => {
  const wrapper = mount(MainScreen);
  expect(wrapper.exists()).toBe(true);
});

test("SecondScreen component", () => {
  const wrapper = mount(SecondScreen);
  expect(wrapper.exists()).toBe(true);
});

test("DefaultLayout component", () => {
  const wrapper = mount(DefaultLayout);
  expect(wrapper.exists()).toBe(true);
});

test("HeaderLayout component", () => {
  const wrapper = mount(HeaderLayout);
  expect(wrapper.exists()).toBe(true);
});
