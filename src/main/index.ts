import { app, BrowserWindow } from "electron";
import { createMainWindow, createErrorWindow } from "./windows";
import { macOSDisableDefaultMenuItem } from "./menus";
import * as constants from "./constants";

let mainWindow: BrowserWindow;

app.on("ready", async () => {
  macOSDisableDefaultMenuItem();
  mainWindow = await createMainWindow();
});

app.on("activate", async () => {
  if (!mainWindow) {
    mainWindow = await createMainWindow();
  }
});

app.on("window-all-closed", () => {
  mainWindow = undefined;

  if (!constants.IS_MAC) {
    app.quit();
  }
});

app.on("render-process-gone", async () => {
  await createErrorWindow(mainWindow);
});

process.on("uncaughtException", async () => {
  await createErrorWindow(mainWindow);
});
