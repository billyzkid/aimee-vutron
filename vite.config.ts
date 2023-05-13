import { defineConfig, BuildOptions } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueI18n from "@intlify/unplugin-vue-i18n/vite";
import vuetify from "vite-plugin-vuetify";
import eslint from "vite-plugin-eslint";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import * as path from "path";

export default defineConfig(async ({ command, mode }) => {
  const { productName, version } = await import("./package.json");
  const { builtinModules } = await import("module");

  // Custom import.meta.env variables
  process.env.VITE_APP_NAME = productName;
  process.env.VITE_APP_VERSION = version;

  // Vite build options shared between processes
  const buildOptions: BuildOptions = {};
  buildOptions.target = "esnext";
  buildOptions.minify = mode === "production" ? "esbuild" : false;
  buildOptions.sourcemap = mode === "development" ? "inline" : false;
  buildOptions.rollupOptions = { external: ["electron", ...builtinModules] };

  // Electron startup arguments used for serve commands
  const startupArgs = command === "serve" ? [".", "--no-sandbox"] : undefined;

  // Allows us to debug the renderer process (see launch.json)
  if (startupArgs !== undefined && process.env.REMOTE_DEBUGGING_PORT !== undefined) {
    startupArgs.push(`--remote-debugging-port=${process.env.REMOTE_DEBUGGING_PORT}`);
  }

  return {
    root: path.resolve("./src/renderer"),
    build: {
      outDir: path.resolve("./dist/renderer"),
      ...buildOptions
    },
    plugins: [
      vue(),
      vueJsx(),
      vueI18n({
        include: path.resolve("./resources/locales/*.json")
      }),
      vuetify(),
      eslint(),
      electron([
        {
          // Main configuration
          entry: path.resolve("./src/main"),
          vite: {
            build: {
              outDir: path.resolve("./dist/main"),
              ...buildOptions
            }
          },
          onstart: (options) => options.startup(startupArgs)
        },
        {
          // Preload configuration
          entry: path.resolve("./src/preload"),
          vite: {
            build: {
              outDir: path.resolve("./dist/preload"),
              ...buildOptions
            }
          },
          onstart: (options) => options.reload()
        }
      ]),
      renderer()
    ]
  };
});
