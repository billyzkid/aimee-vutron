import { app } from "electron";
import { checkForUpdates } from "./updater";
import { installExtension, VUE_DEVTOOLS_EXTENSION_ID } from "./extensions";
import { createMainWindow, openMainWindow } from "./windows";
import { secureWebContents } from "./security";
import "./ipc";

// Terminate the process if another instance of the app is already running
if (!app.requestSingleInstanceLock()) {
  console.debug("Failed to obtain single instance lock.");
  process.exit(0);
}

// TODO: Consider disabling hardware acceleration
// https://github.com/electron/electron/issues/13368
// app.disableHardwareAcceleration();

// Check for app updates in production
if (import.meta.env.PROD) {
  checkForUpdates().catch((error) => console.error("Failed to check for updates.", error));
}

// Installs the Vue Devtools Extension (https://devtools.vuejs.org)
// and creates the main application window when the app is ready
app.once("ready", async () => {
  if (import.meta.env.DEV) {
    try {
      await installExtension(VUE_DEVTOOLS_EXTENSION_ID);
    } catch (error) {
      console.error("Failed to install the Vue Devtools Extension.", error);
    }
  }

  createMainWindow().catch((error) => console.error("Failed to create main window.", error));
});

// Open the main window when the app is activated
app.on("activate", () => {
  openMainWindow().catch((error) => console.error("Failed to open main window.", error));
});

// Open the main window when a second instance of the app is executed
app.on("second-instance", () => {
  openMainWindow().catch((error) => console.error("Failed to open main window.", error));
});

// Enforce security for the created web contents
app.on("web-contents-created", (event, webContents) => {
  secureWebContents(webContents);
});

// Quit the app when all windows are closed
// Note MacOS apps are typically quit with Command+Q explicitly
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
