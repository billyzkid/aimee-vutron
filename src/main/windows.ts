import { BrowserWindow, Menu } from "electron";
import * as path from "path";

// Suppress the default menu for each window
// https://github.com/electron/electron/issues/35512
Menu.setApplicationMenu(null);

// Creates and loads the main application window
export async function createMainWindow() {
  // Create the window
  const window = new BrowserWindow({
    show: false,
    title: import.meta.env.VITE_APP_NAME,
    width: import.meta.env.DEV ? 1500 : 1200, // Accomodate the dev tools
    height: 650,
    useContentSize: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js")
    }
  });

  // Show the window when it's ready
  // Note this prevents a flicker before the window has loaded content
  window.on("ready-to-show", () => {
    // Show and give focus to the window
    window.show();

    // Open the devtools in development
    if (import.meta.env.DEV) {
      window.webContents.openDevTools();
    }
  });

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
