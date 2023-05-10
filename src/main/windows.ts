import { app, BrowserWindow } from "electron";
import { initializeIpc } from "./ipc";
import * as constants from "./constants";

export async function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: constants.APP_NAME,
    width: constants.IS_DEV ? 1500 : 1200,
    height: 650,
    useContentSize: true,
    webPreferences: constants.DEFAULT_WEB_PREFERENCES,
    show: false
  });

  mainWindow.setMenu(null);

  mainWindow.on("close", (event: Event): void => {
    event.preventDefault();
    exitApp(mainWindow);
  });

  mainWindow.webContents.on("did-frame-finish-load", (): void => {
    if (constants.IS_DEV) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.once("ready-to-show", (): void => {
    mainWindow.setAlwaysOnTop(true);
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(false);
  });

  if (constants.IS_DEV) {
    await mainWindow.loadURL(constants.APP_INDEX_URL_DEV);
  } else {
    await mainWindow.loadFile(constants.APP_INDEX_URL_PROD);
  }

  initializeIpc(mainWindow);

  return mainWindow;
}

export async function createErrorWindow(mainWindow: BrowserWindow) {
  if (!constants.IS_DEV) {
    mainWindow?.hide();
  }

  const errorWindow = new BrowserWindow({
    title: constants.APP_NAME,
    resizable: constants.IS_DEV,
    webPreferences: constants.DEFAULT_WEB_PREFERENCES,
    show: false
  });

  errorWindow.setMenu(null);

  if (constants.IS_DEV) {
    await errorWindow.loadURL(`${constants.APP_INDEX_URL_DEV}#/error`);
  } else {
    await errorWindow.loadFile(constants.APP_INDEX_URL_PROD, { hash: "error" });
  }

  errorWindow.on("ready-to-show", (): void => {
    if (mainWindow && !mainWindow.isDestroyed() && !constants.IS_DEV) {
      mainWindow.destroy();
    }

    errorWindow.show();
    errorWindow.focus();
  });

  errorWindow.webContents.on("did-frame-finish-load", (): void => {
    if (constants.IS_DEV) {
      errorWindow.webContents.openDevTools();
    }
  });

  return errorWindow;
}

function exitApp(mainWindow: BrowserWindow) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.hide();
  }

  mainWindow.destroy();
  app.exit();
}
