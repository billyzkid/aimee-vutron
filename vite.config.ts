import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueI18n from "@intlify/unplugin-vue-i18n/vite";
import vuetify from "vite-plugin-vuetify";
import eslint from "vite-plugin-eslint";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import { builtinModules } from "module";
import * as path from "path";

export default defineConfig(async ({ command, mode }) => {
  const { productName, version } = await import("./package.json");

  process.env.VITE_APP_NAME = productName;
  process.env.VITE_APP_VERSION = version;

  const minify = mode === "production" ? "esbuild" : false;
  const sourcemap = mode === "development" ? "inline" : false;
  const startupArgv = command === "serve" ? [".", "--no-sandbox"] : undefined;

  if (startupArgv !== undefined && process.env.REMOTE_DEBUGGING_PORT !== undefined) {
    startupArgv.push(`--remote-debugging-port=${process.env.REMOTE_DEBUGGING_PORT}`);
  }

  return {
    root: path.resolve("./src/renderer"),
    build: {
      outDir: path.resolve("./dist"),
      minify,
      sourcemap
    },
    resolve: {
      alias: { "@": path.resolve("./src") }
    },
    plugins: [
      vue(),
      vueJsx(),
      vueI18n({
        include: [path.resolve("./resources/locales/**")]
      }),
      vuetify(),
      eslint(),
      electron([
        {
          // Main configuration
          onstart: (options) => options.startup(startupArgv),
          entry: path.resolve("./src/main/index.ts"),
          vite: {
            build: {
              outDir: path.resolve("./dist/main"),
              minify,
              sourcemap,
              rollupOptions: {
                external: ["electron", ...builtinModules]
              }
            }
          }
        },
        {
          // Preload configuration
          onstart: (options) => options.reload(),
          entry: path.resolve("./src/preload/index.ts"),
          vite: {
            build: {
              outDir: path.resolve("./dist/preload"),
              minify,
              sourcemap,
              rollupOptions: {
                external: ["electron", ...builtinModules]
              }
            }
          }
        }
      ]),
      renderer()
    ]
  };
});
