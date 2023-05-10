import { defineConfig } from "vite";
import electronPlugin from "vite-plugin-electron";
import rendererPlugin from "vite-plugin-electron-renderer";
import eslintPlugin from "vite-plugin-eslint";
import vuetifyPlugin from "vite-plugin-vuetify";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { builtinModules } from "module";

export default defineConfig(() => {
  const srcDir = resolve("./src");
  const distDir = resolve("./dist");

  return {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false
    },
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".vue", ".json", ".scss"],
      alias: {
        "@": srcDir
      }
    },
    base: "",
    root: resolve(srcDir, "renderer"),
    build: {
      outDir: distDir,
      sourcemap: true
    },
    plugins: [
      vue(),
      vueJsx(),
      vuetifyPlugin(),
      eslintPlugin(),
      electronPlugin([
        {
          onstart: (options) => options.startup([".", "--no-sandbox", "--remote-debugging-port=9222"]),
          entry: [resolve(srcDir, "main/index.ts")],
          vite: {
            build: {
              outDir: resolve(distDir, "main"),
              sourcemap: true,
              rollupOptions: {
                external: ["electron", ...builtinModules]
              }
            }
          }
        },
        {
          // Reload the page
          onstart: (options) => options.reload(),
          entry: [resolve(srcDir, "preload/index.ts")],
          vite: {
            build: {
              outDir: resolve(distDir, "preload"),
              sourcemap: true
            }
          }
        }
      ]),
      rendererPlugin()
    ]
  };
});
