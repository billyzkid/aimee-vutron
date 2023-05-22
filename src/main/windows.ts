import { Menu, BrowserWindow } from "electron";
import * as path from "path";

// Suppress the default application menu
// https://github.com/electron/electron/issues/35512
Menu.setApplicationMenu(null);

// Creates and initializes the main application window
export async function createMainWindow() {
  const window = new BrowserWindow({
    show: false,
    title: import.meta.env.VITE_APP_NAME,
    width: import.meta.env.DEV ? 1500 : 1200, // Accomodate the devtools
    height: 650,
    useContentSize: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js")
    }
  });

  // Show the window when it's ready
  window.on("ready-to-show", () => {
    window.show();
  });

  // Open the devtools in development
  if (import.meta.env.DEV) {
    window.webContents.openDevTools();
  }

  // Load the window content
  if (import.meta.env.VITE_DEV_SERVER_URL !== undefined) {
    await window.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
  } else {
    await window.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  return window;
}

// Ensures the main application window is visible and focused
export async function openMainWindow() {
  let window = BrowserWindow.getAllWindows().find((window) => !window.isDestroyed());

  if (window === undefined) {
    window = await createMainWindow();
  } else if (window.isMinimized()) {
    window.restore();
  } else if (!window.isFocused()) {
    window.focus();
  }

  return window;
}
