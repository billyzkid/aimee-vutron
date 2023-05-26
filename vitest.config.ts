import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueI18n from "@intlify/unplugin-vue-i18n/vite";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  test: {
    include: ["./tests/*.spec.ts"],
    testTimeout: 10000,
    environment: "happy-dom",
    deps: {
      inline: ["vuetify"]
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    vueI18n({
      include: ["./resources/locales/*.json"]
    }),
    vuetify()
  ]
});
