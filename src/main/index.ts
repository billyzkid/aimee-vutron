import { app, BrowserWindow } from "electron";
import { createMainWindow, createErrorWindow } from "./windows";
import { macOSDisableDefaultMenuItem } from "./menus";

let mainWindow: BrowserWindow | undefined;

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

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("render-process-gone", async () => {
  await createErrorWindow(mainWindow);
});

process.on("uncaughtException", async () => {
  await createErrorWindow(mainWindow);
});
