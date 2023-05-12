import { mergeConfig, defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ["./tests/**/*.spec.ts"],
      testTimeout: 30000,
      hookTimeout: 30000
    }
  })
);
