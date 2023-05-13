import { app } from "electron";
import { createMainWindow, restoreOrCreateWindow } from "./windows";
import "./ipc";
import "./security";

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Save system resources
app.disableHardwareAcceleration();

// Create the main window when the app
// is ready to create browser windows.
app
  .whenReady()
  .then(createMainWindow)
  .catch((x) => console.error("Failed to create window.", x));

// Install the Vue Devtools extension in development.
// Note this requires the `electron-devtools-installer` dev dependency.
// See https://devtools.vuejs.org/
// if (import.meta.env.DEV) {
//   app
//     .whenReady()
//     .then(() => import("electron-devtools-installer"))
//     .then((module) => {
//       // const { default: installExtension, VUEJS3_DEVTOOLS } = module;
//       // return installExtension(VUEJS3_DEVTOOLS, { loadExtensionOptions: { allowFileAccess: true } });

//       // @ts-expect-error see https://github.com/cawa-93/vite-electron-builder/issues/915
//       const { default: installExtension, VUEJS3_DEVTOOLS } = typeof module.default === "function" ? module : (module.default as typeof module);
//       return installExtension(VUEJS3_DEVTOOLS, { loadExtensionOptions: { allowFileAccess: true } });
//     })
//     .catch((x) => console.error("Failed to install the Vue Devtools extension.", x));
// }

// Check for app updates in production.
// Note this requires the `electron-updater` dependency.
// Note this may throw if the app is not yet published or configured for debugging.
// See https://www.electron.build/auto-update.html#quick-setup-guide
// See https://www.electron.build/auto-update.html#debugging
// if (import.meta.env.PROD) {
//   app
//     .whenReady()
//     .then(() => import("electron-updater"))
//     .then((module) => {
//       const { autoUpdater } = module;
//       return autoUpdater.checkForUpdatesAndNotify();
//     })
//     .catch((x) => console.error("Failed to check for app updates.", x));
// }

// Ensure a window is open when the app is activated
app.on("activate", () => {
  restoreOrCreateWindow().catch((x) => console.error("Failed to restore or create window.", x));
});

// Ensure a window is open when an attempt is made to
// run a second instance of the app
app.on("second-instance", () => {
  restoreOrCreateWindow().catch((x) => console.error("Failed to restore or create window.", x));
});

// Quit the app if all windows are closed.
// Note macOS users typically quit the app explicitly using Command+Q
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
