import { UserConfigExport } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vuetify from "vite-plugin-vuetify";
import eslint from "vite-plugin-eslint";
import electron, { Configuration } from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import { builtinModules } from "module";
import { productName, version } from "./package.json";
import * as path from "path";

process.env.VITE_APP_NAME = productName;
process.env.VITE_APP_VERSION = version;

const isDevelopment = process.env.NODE_ENV === "development";
const isDebugging = process.env.REMOTE_DEBUGGING_PORT !== undefined;



const sourcemap = isDebugging ? "inline" : false;
const minify = !isDevelopment ? "esbuild" : false;

const srcDir = path.resolve("./src");
const distDir = path.resolve("./dist");

const mainConfig: Configuration = {
  entry: path.join(srcDir, "main", "index.ts"),
  vite: {
    build: {
      outDir: path.join(distDir, "main"),
      sourcemap,
      minify,
      rollupOptions: {
        external: ["electron", ...builtinModules]
      }
    }
  },
  onstart: (options) => {
    if (isDebugging) {
      return options.startup([".", "--no-sandbox", `--remote-debugging-port=${process.env.REMOTE_DEBUGGING_PORT}`]);
    } else {
      return options.startup();
    }
  }
};

const preloadConfig: Configuration = {
  entry: path.join(srcDir, "preload", "index.ts"),
  vite: {
    build: {
      outDir: path.join(distDir, "preload"),
      sourcemap,
      minify
    }
  },
  onstart: (options) => options.reload()
};

const userConfig: UserConfigExport = {
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false
  },
  base: "",
  root: path.join(srcDir, "renderer"),
  build: {
    outDir: distDir,
    sourcemap,
    minify
  },
  resolve: {
    extensions: [".mjs", ".js", ".ts", ".vue", ".json", ".scss"],
    alias: { "@": srcDir }
  },
  plugins: [vue(), vueJsx(), vuetify(), eslint(), electron([mainConfig, preloadConfig]), renderer()]
};

export default userConfig;
