import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vuetify from "vite-plugin-vuetify";
import eslint from "vite-plugin-eslint";
import electron, { Configuration } from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import { builtinModules } from "module";
import * as path from "path";

export default defineConfig(async ({ command, mode }) => {
  const { productName, version } = await import("./package.json");

  process.env.VITE_APP_NAME = productName;
  process.env.VITE_APP_VERSION = version;

  const srcDir = path.resolve("./src");
  const distDir = path.resolve("./dist");

  const minify = mode === "production" ? "esbuild" : false;
  const sourcemap = mode === "development" ? "inline" : false;
  const startupArgv = command === "serve" ? [".", "--no-sandbox"] : undefined;

  if (startupArgv !== undefined && process.env.REMOTE_DEBUGGING_PORT !== undefined) {
    startupArgv.push(`--remote-debugging-port=${process.env.REMOTE_DEBUGGING_PORT}`);
  }

  const mainConfig: Configuration = {
    entry: path.join(srcDir, "main", "index.ts"),
    vite: {
      build: {
        outDir: path.join(distDir, "main"),
        minify,
        sourcemap,
        rollupOptions: {
          external: ["electron", ...builtinModules]
        }
      }
    },
    onstart: (options) => options.startup(startupArgv)
  };

  const preloadConfig: Configuration = {
    entry: path.join(srcDir, "preload", "index.ts"),
    vite: {
      build: {
        outDir: path.join(distDir, "preload"),
        minify,
        sourcemap
      }
    },
    onstart: (options) => options.reload()
  };

  return {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false
    },
    root: path.join(srcDir, "renderer"),
    build: {
      outDir: distDir,
      minify,
      sourcemap
    },
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".vue", ".json", ".scss"],
      alias: { "@": srcDir }
    },
    plugins: [vue(), vueJsx(), vuetify(), eslint(), electron([mainConfig, preloadConfig]), renderer()]
  };
});
