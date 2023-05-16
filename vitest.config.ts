import { mergeConfig, defineConfig } from "vitest/config";
import viteConfig from "./vite.config";
import vue from "@vitejs/plugin-vue";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ["./tests/**/*.spec.ts"],
      testTimeout: 10000
    },
    plugins: [vue()]
  })
);
