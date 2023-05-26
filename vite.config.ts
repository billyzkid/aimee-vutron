import { defineConfig, BuildOptions } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueI18n from "@intlify/unplugin-vue-i18n/vite";
import vuetify from "vite-plugin-vuetify";
import eslint from "vite-plugin-eslint";
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron-renderer";
import * as pkg from "./package.json";
import * as path from "path";

export default defineConfig(({ mode }) => {
  const srcDir = path.resolve("./src");
  const distDir = path.resolve("./dist");
  const resourcesDir = path.resolve("./resources");

  // Environment variables imported by the app
  process.env.VITE_APP_NAME = pkg.productName;
  process.env.VITE_APP_VERSION = pkg.version;

  // Note this check is needed due to process.env string coercion
  // https://github.com/nodejs/node/issues/12126
  if (process.env.REMOTE_DEBUGGING_PORT !== undefined) {
    process.env.VITE_REMOTE_DEBUGGING_PORT = process.env.REMOTE_DEBUGGING_PORT;
  }

  // Build options shared by the main and renderer processes
  const buildOptions: BuildOptions = {
    target: "esnext",
    minify: mode === "production" ? "esbuild" : false,
    sourcemap: mode === "development" ? "inline" : false,
    emptyOutDir: mode === "production",
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)]
    }
  };

  return {
    // define: {
    //   __VUE_PROD_DEVTOOLS__: true
    // },
    root: path.join(srcDir, "renderer"),
    build: { ...buildOptions, outDir: path.join(distDir, "renderer") },
    plugins: [
      vue(),
      vueJsx(),
      vueI18n({ include: path.join(resourcesDir, "locales/*.json") }),
      vuetify(),
      eslint(),
      electron([
        {
          // Main configuration
          onstart: (options) => options.startup(),
          entry: path.join(srcDir, "main"),
          vite: {
            build: { ...buildOptions, outDir: path.join(distDir, "main") }
          }
        },
        {
          // Preload configuration
          onstart: (options) => options.reload(),
          entry: path.join(srcDir, "preload"),
          vite: {
            build: { ...buildOptions, outDir: path.join(distDir, "preload") }
          }
        }
      ]),
      electronRenderer()
    ]
  };
});
