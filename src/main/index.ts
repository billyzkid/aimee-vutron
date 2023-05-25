import { app } from "electron";
import { suppressDefaultMenu, registerGlobalShortcuts } from "./menus";
import { createMainWindow, openDefaultWindow, openDevTools } from "./windows";
import { setDefaultHandlers } from "./security";
import loadExtension from "./extensions";
import checkForUpdate from "./updates";
import * as constants from "./constants";
import "./ipc";

// Exit the app if another instance is already running
if (!app.requestSingleInstanceLock()) {
  console.log("Exiting application due to denied request for single instance lock.");
  app.exit();
}

// Disable hardware acceleration
// https://github.com/electron/electron/issues/13368
app.disableHardwareAcceleration();

// Suppress the default application menu
// https://github.com/electron/electron/issues/35512
//replaceDefaultMenu();
suppressDefaultMenu();

// Initialize the app when Electron is initialized
// This registers global shortcuts and creates the main application window
// In development, this additionally loads an extension first and opens the devtools last
// In production, this additionally checks for an app update first
if (import.meta.env.DEV) {
  app
    .whenReady()
    .then(tryLoadVueDevtoolsExtension)
    .then(registerGlobalShortcuts)
    .then(createMainWindow)
    .then(openDevTools)
    .catch((reason) => console.error(`Failed to initialize application.`, { reason, mode: import.meta.env.MODE }));
} else {
  Promise.all([app.whenReady(), tryCheckForUpdate()])
    .then(registerGlobalShortcuts)
    .then(createMainWindow)
    .catch((reason) => console.error(`Failed to initialize application.`, { reason, mode: import.meta.env.MODE }));
}

// Open the default window when the app is activated
app.on("activate", (...args) => {
  openDefaultWindow().catch((reason) => console.error(`Failed to open default window.`, { reason, ...args }));
});

// Open the default window when a second instance of the app is executed
app.on("second-instance", (...args) => {
  openDefaultWindow().catch((reason) => console.error(`Failed to open default window.`, { reason, ...args }));
});

// Set the default security handlers for created web contents
app.on("web-contents-created", (event, webContents) => {
  setDefaultHandlers(webContents);
});

// Quit the app when all windows are closed except on Mac
// where apps are typically quit with Command+Q explicitly
app.on("window-all-closed", () => {
  if (!constants.PLATFORM_MAC) {
    app.quit();
  }
});

// Attempts to load the Vue Devtools Extension
// Note this should fail gracefully
async function tryLoadVueDevtoolsExtension() {
  try {
    if (import.meta.env.VITE_DEV_SERVER_URL !== undefined) {
      await loadExtension(constants.VUE_DEVTOOLS_EXTENSION_ID);
    } else {
      await loadExtension(constants.VUE_DEVTOOLS_EXTENSION_ID, { allowFileAccess: true });
    }
  } catch (error) {
    console.error("Failed to load Vue Devtools Extension.", { reason: error });
  }
}

// Attempts to check for an application update
// Note this should fail gracefully
async function tryCheckForUpdate() {
  try {
    await checkForUpdate();
  } catch (error) {
    console.error("Failed to check for application update.", { reason: error });
  }
}
