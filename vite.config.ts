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

export default defineConfig(({ command, mode }) => {
  const srcDir = path.resolve("./src");
  const distDir = path.resolve("./dist");
  const resourcesDir = path.resolve("./resources");

  // Electron enviroment variables
  // process.env.ELECTRON_ENABLE_LOGGING = "0";
  // process.env.ELECTRON_NO_ATTACH_CONSOLE = "1";

  // Vite environment variables imported by the app
  process.env.VITE_APP_NAME = pkg.productName;
  process.env.VITE_APP_VERSION = pkg.version;

  // Vite build options shared by the main and renderer processes
  const buildOptions: BuildOptions = {
    target: "esnext",
    minify: mode === "production" ? "esbuild" : false,
    sourcemap: mode === "development" ? "inline" : false,
    emptyOutDir: mode === "production",
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)]
    }
  };

  // Electron startup arguments used to debug the renderer process
  const startupArgs =
    command === "serve" && process.env.REMOTE_DEBUGGING_PORT !== undefined
      ? [".", "--no-sandbox", `--remote-debugging-port=${process.env.REMOTE_DEBUGGING_PORT}`]
      : undefined;

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
          entry: path.join(srcDir, "main"),
          vite: {
            build: { ...buildOptions, outDir: path.join(distDir, "main") }
          },
          onstart: (options) => options.startup(startupArgs)
        },
        {
          entry: path.join(srcDir, "preload"),
          vite: {
            build: { ...buildOptions, outDir: path.join(distDir, "preload") }
          },
          onstart: (options) => options.reload()
        }
      ]),
      electronRenderer()
    ]
  };
});
