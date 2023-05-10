import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vuetifyPlugin from "vite-plugin-vuetify";
import eslintPlugin from "vite-plugin-eslint";
import electronPlugin from "vite-plugin-electron";
import rendererPlugin from "vite-plugin-electron-renderer";
import { builtinModules } from "module";
import path from "path";

export default defineConfig(() => {
  return {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false
    },
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".vue", ".json", ".scss"],
      alias: {
        "@": path.resolve("./src")
      }
    },
    base: "",
    root: path.resolve("./src/renderer"),
    build: {
      outDir: path.resolve("./dist"),
      sourcemap: true
    },
    plugins: [
      vue(),
      vueJsx(),
      vuetifyPlugin(),
      eslintPlugin(),
      electronPlugin([
        {
          onstart: (options) => {
            const args = getElectronArgs();
            return options.startup(args);
          },
          entry: [path.resolve("./src/main/index.ts")],
          vite: {
            build: {
              outDir: path.resolve("./dist/main"),
              sourcemap: true,
              rollupOptions: {
                external: ["electron", ...builtinModules]
              }
            }
          }
        },
        {
          onstart: (options) => options.reload(),
          entry: [path.resolve("./src/preload/index.ts")],
          vite: {
            build: {
              outDir: path.resolve("./dist/preload"),
              sourcemap: true
            }
          }
        }
      ]),
      rendererPlugin()
    ]
  };
});

function getElectronArgs(): string[] {
  const args = [".", "--no-sandbox"];

  if (process.env.NODE_ENV === "development" && process.env.REMOTE_DEBUGGING_PORT !== undefined) {
    args.push(`--remote-debugging-port=${process.env.REMOTE_DEBUGGING_PORT}`);
  }

  return args;
}
