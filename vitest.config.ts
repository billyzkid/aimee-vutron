import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["./tests/*.spec.ts"],
    testTimeout: 10000,
    deps: {
      inline: ["vuetify"]
    }
  },
  plugins: [vue(), vueJsx(), vuetify()]
});
