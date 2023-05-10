import { app, BrowserWindow } from "electron";
import { initializeIpc } from "./ipc";
import * as path from "path";

export async function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: import.meta.env.VITE_APP_NAME,
    width: 1500,
    height: 650,
    useContentSize: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "../preload/index.js")
    }
  });

  mainWindow.setMenu(null);

  mainWindow.on("close", (event: Event): void => {
    event.preventDefault();
    exitApp(mainWindow);
  });

  mainWindow.webContents.on("did-frame-finish-load", (): void => {
    if (import.meta.env.DEV) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.once("ready-to-show", (): void => {
    mainWindow.setAlwaysOnTop(true);
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(false);
  });

  if (import.meta.env.DEV) {
    await mainWindow.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
  } else {
    await mainWindow.loadFile(path.join(__dirname, "../index.html"));
  }

  initializeIpc(mainWindow);

  return mainWindow;
}

export async function createErrorWindow(mainWindow: BrowserWindow) {
  if (import.meta.env.PROD) {
    mainWindow?.hide();
  }

  const errorWindow = new BrowserWindow({
    title: import.meta.env.VITE_APP_NAME,
    resizable: import.meta.env.DEV,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "../preload/index.js")
    }
  });

  errorWindow.setMenu(null);

  if (import.meta.env.DEV) {
    await errorWindow.loadURL(import.meta.env.VITE_DEV_SERVER_URL + "#/error");
  } else {
    await errorWindow.loadFile(path.join(__dirname, "../index.html"), { hash: "error" });
  }

  errorWindow.on("ready-to-show", (): void => {
    if (mainWindow && !mainWindow.isDestroyed() && import.meta.env.PROD) {
      mainWindow.destroy();
    }

    errorWindow.show();
    errorWindow.focus();
  });

  errorWindow.webContents.on("did-frame-finish-load", (): void => {
    if (import.meta.env.DEV) {
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
