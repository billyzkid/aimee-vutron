import { app, Menu } from "electron";
import { openMainWindow } from "./windows";
import { secureWebContents } from "./security";
import "./ipc";

// Exit if the app is already running
if (!app.requestSingleInstanceLock()) {
  process.exit(0);
}

// Disable the default application menu
// https://github.com/electron/electron/issues/35512
Menu.setApplicationMenu(null);

// TODO: Consider disabling hardware acceleration
// https://github.com/electron/electron/issues/13368
app.disableHardwareAcceleration();

// if (import.meta.env.PROD) {
//   await tryInstallAppUpdates();
// }

// if (import.meta.env.DEV) {
//   await tryInstallDevtoolsExtension();
// }

// Open the main window when the app is ready
app.once("ready", () => {
  openMainWindow().catch((x) => console.error("Failed to open the main window.", x));
});

// Ensure the main window is opened when the app is activated
app.on("activate", () => {
  openMainWindow().catch((x) => console.error("Failed to open the main window.", x));
});

// Ensure the main window is opened when a second instance of the app is executed
app.on("second-instance", () => {
  openMainWindow().catch((x) => console.error("Failed to open the main window.", x));
});

// Enforce security for created web contents
app.on("web-contents-created", (event, webContents) => {
  secureWebContents(webContents);
});

// Quit the app when all windows are closed
// Note MacOS apps are quit explicitly with Command+Q
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Attempts to detect and install app updates
// https://www.electron.build/auto-update.html#quick-setup-guide
// https://github.com/iffy/electron-updater-example
async function tryInstallAppUpdates() {
  try {
    const { autoUpdater } = await import("electron-updater");
    return await autoUpdater.checkForUpdatesAndNotify();
  } catch (x) {
    console.error("Failed to install app updates.", x);
  }
}

// Attempts to install the Vue Devtools extension
// https://devtools.vuejs.org/
// https://github.com/xupea/electron-devtools-installer#readme
async function tryInstallDevtoolsExtension() {
  try {
    const { default: installExtension, VUEJS_DEVTOOLS } = await import("electron-devtools-assembler");
    return await installExtension(VUEJS_DEVTOOLS);
  } catch (x) {
    console.error("Failed to install Vue Devtools extension.", x);
  }
}
