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

  const target = "esnext";
  const minify = mode === "production" ? "esbuild" : false;
  const sourcemap = mode === "development" ? "inline" : false;
  const startupArgv = command === "serve" ? [".", "--no-sandbox"] : undefined;

  if (startupArgv !== undefined && process.env.REMOTE_DEBUGGING_PORT !== undefined) {
    startupArgv.push(`--remote-debugging-port=${process.env.REMOTE_DEBUGGING_PORT}`);
  }

  return {
    root: path.resolve("./src/renderer"),
    build: {
      target,
      minify,
      sourcemap,
      outDir: path.resolve("./dist"),
    },
    plugins: [
      vue(),
      vueJsx(),
      vueI18n({
        include: [path.resolve("./resources/locales/*.json")]
      }),
      vuetify(),
      eslint(),
      electron([
        {
          // Main configuration
          entry: path.resolve("./src/main/index.ts"),
          vite: {
            build: {
              target,
              minify,
              sourcemap,
              outDir: path.resolve("./dist/main"),
              rollupOptions: {
                external: ["electron", ...builtinModules]
              }
            }
          },
          onstart: (options) => options.startup(startupArgv)
        },
        {
          // Preload configuration
          entry: path.resolve("./src/preload/index.ts"),
          vite: {
            build: {
              target,
              minify,
              sourcemap,
              outDir: path.resolve("./dist/preload"),
              rollupOptions: {
                external: ["electron", ...builtinModules]
              }
            }
          },
          onstart: (options) => options.reload()
        }
      ]),
      renderer()
    ]
  };
});
