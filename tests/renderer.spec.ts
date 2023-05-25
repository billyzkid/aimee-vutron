import { vi, test, expect, afterEach } from "vitest";
import { config, mount } from "@vue/test-utils";
import { i18n, pinia, router, vuetify } from "../src/renderer/plugins";
import { VApp } from "vuetify/components/VApp";

import App from "../src/renderer/components/App.vue";
import MainScreen from "../src/renderer/components/screens/MainScreen.vue";
import SecondScreen from "../src/renderer/components/screens/SecondScreen.vue";
import DefaultLayout from "../src/renderer/components/layout/DefaultLayout.vue";
import HeaderLayout from "../src/renderer/components/layout/HeaderLayout.vue";

config.global.plugins = [i18n, pinia, router, vuetify];

// Ensures any Vue console warnings or errors cause the test to fail
function fail(message: string) {
  throw new Error(message);
}

vi.mock("console", () => ({
  warn: vi.fn(fail),
  error: vi.fn(fail)
}));

afterEach(() => {
  vi.clearAllMocks();
});

test("Should mount the App component", () => {
  const wrapper = mount(App);
  expect(wrapper.exists()).toBe(true);
});

test("Should mount the MainScreen component", () => {
  const wrapper = mount(MainScreen);
  expect(wrapper.exists()).toBe(true);
});

test("Should mount the SecondScreen component", () => {
  const wrapper = mount(SecondScreen);
  expect(wrapper.exists()).toBe(true);
});

test("Should mount the DefaultLayout component", () => {
  const wrapper = mount(DefaultLayout);
  expect(wrapper.exists()).toBe(true);
});

test("Should mount the HeaderLayout component", () => {
  const InjectedHeaderLayout = {
    template: "<v-app><header-layout /></v-app>",
    components: { VApp, HeaderLayout }
  };

  const wrapper = mount(InjectedHeaderLayout);
  expect(wrapper.exists()).toBe(true);
});
