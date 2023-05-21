import { app } from "electron";
import { openMainWindow } from "./windows";
import { secureWebContents } from "./security";
import { checkForUpdates } from "./updater";
import "./ipc";

// Terminate the process if an instance of the app is already running
if (!app.requestSingleInstanceLock()) {
  process.exit(0);
}

// Check for app updates in production
if (import.meta.env.PROD) {
  checkForUpdates();
}

// TODO: Consider disabling hardware acceleration
// https://github.com/electron/electron/issues/13368
// app.disableHardwareAcceleration();

// Attempt to install the Vue Devtools extension in development
// and open the main window when the app is ready
app.once("ready", () => {
  if (import.meta.env.DEV) {
    tryInstallVueDevtoolsExtension().then(tryOpenMainWindow);
  } else {
    tryOpenMainWindow();
  }
});

// Ensure the main window is opened when the app is activated
app.on("activate", () => {
  tryOpenMainWindow();
});

// Ensure the main window is opened when a second instance of the app is executed
app.on("second-instance", () => {
  tryOpenMainWindow();
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

// Attempts to install the Vue Devtools extension
// https://devtools.vuejs.org/
// https://github.com/xupea/electron-devtools-installer#readme
async function tryInstallVueDevtoolsExtension() {
  try {
    const { default: installExtension, VUEJS_DEVTOOLS } = await import("electron-devtools-assembler");
    await installExtension(VUEJS_DEVTOOLS);
  } catch (x) {
    console.error("Failed to install Vue Devtools extension.", x);
  }
}

// Attempts to open the main app window
async function tryOpenMainWindow() {
  try {
    await openMainWindow();
  } catch (x) {
    console.error("Failed to open main window.", x);
  }
}
