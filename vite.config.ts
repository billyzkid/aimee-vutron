import { defineConfig, BuildOptions } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueI18n from "@intlify/unplugin-vue-i18n/vite";
import vuetify from "vite-plugin-vuetify";
import eslint from "vite-plugin-eslint";
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron-renderer";
import { productName, version, dependencies } from "./package.json";
import * as path from "path";

export default defineConfig(({ mode }) => {
  const srcDir = path.resolve("./src");
  const distDir = path.resolve("./dist");

  // Common build options
  const buildOptions: BuildOptions = {
    target: "esnext",
    minify: mode === "production" ? "esbuild" : false,
    sourcemap: mode === "development" ? "inline" : false,
    rollupOptions: mode === "development" ? { external: [...Object.keys(dependencies)] } : undefined,
    emptyOutDir: mode === "production"
  };

  // Imported environment variables (see ./src/types.d.ts)
  process.env.VITE_APP_TITLE = mode === "production" ? productName : `${productName} (${mode})`;
  process.env.VITE_APP_VERSION = version;

  return {
    // define: {
    //   __VUE_PROD_DEVTOOLS__: true
    // },
    root: path.join(srcDir, "renderer"),
    build: { ...buildOptions, outDir: path.join(distDir, "renderer") },
    plugins: [
      vue(),
      vueJsx(),
      vueI18n({
        include: ["./resources/locales/*.json"]
      }),
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
