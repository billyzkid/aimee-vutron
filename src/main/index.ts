import { app } from "electron";
import Constants from "./Constants";
import { createErrorWindow, createMainWindow } from "./MainRunner";
import { macOSDisableDefaultMenuItem } from "./Menus";

let mainWindow;
let errorWindow;

app.on("ready", () => {
  macOSDisableDefaultMenuItem();

  mainWindow = createMainWindow(mainWindow);
});

app.on("activate", () => {
  if (!mainWindow) {
    mainWindow = createMainWindow(mainWindow);
  }
});

app.on("window-all-closed", () => {
  mainWindow = null;
  errorWindow = null;

  if (!Constants.IS_MAC) {
    app.quit();
  }
});

app.on("render-process-gone", () => {
  errorWindow = createErrorWindow(errorWindow, mainWindow);
});

process.on("uncaughtException", () => {
  errorWindow = createErrorWindow(errorWindow, mainWindow);
});
