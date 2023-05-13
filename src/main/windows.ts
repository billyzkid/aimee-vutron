import { BrowserWindow } from "electron";
import { initializeIpc } from "./ipc";
import * as path from "path";

// Creates and initializes the main application window
export async function createMainWindow() {
  // Create the window
  const mainWindow = new BrowserWindow({
    title: import.meta.env.VITE_APP_NAME,
    width: import.meta.env.DEV ? 1500 : 1200, // Accomodate the dev tools
    height: 650,
    useContentSize: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      nodeIntegration: false,
      contextIsolation: true
      //sandbox: false
    }
  });

  // Hide the menu bar
  // Use mainWindow.removeMenu() to disable shortcuts
  mainWindow.setMenuBarVisibility(false);

  // Show the window when it's ready
  // Note this prevents a flicker when the window loads its content below
  // See https://github.com/electron/electron/issues/25012
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();

    // Open the dev tools in development
    if (import.meta.env.DEV) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Load the window content based on the current environment
  if (import.meta.env.VITE_DEV_SERVER_URL !== undefined) {
    await mainWindow.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
  } else {
    await mainWindow.loadFile(path.join(__dirname, "../index.html"));
  }

  initializeIpc(mainWindow);

  return mainWindow;
}

// Restores an existing window or creates a new one
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

  if (window === undefined) {
    window = await createMainWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
