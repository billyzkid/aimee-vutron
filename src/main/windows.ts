import { BrowserWindow } from "electron";
import * as path from "path";
import * as constants from "./constants";

const getDefaultWindow = () => BrowserWindow.getAllWindows().find((window) => !window.isDestroyed());
const getFocusedWindow = () => BrowserWindow.getFocusedWindow() ?? undefined;

// Creates and initializes the main window
export async function createMainWindow() {
  const window = new BrowserWindow({
    title: constants.MAIN_WINDOW_TITLE,
    width: constants.MAIN_WINDOW_WIDTH,
    height: constants.MAIN_WINDOW_HEIGHT,
    useContentSize: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js")
    }
  });

  // Show the window once the page is rendered
  window.once("ready-to-show", window.show);

  // Wait for the page to load
  if (import.meta.env.VITE_DEV_SERVER_URL !== undefined) {
    await window.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
  } else {
    await window.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  return window;
}

// Opens the default window, creating a new instance if necessary
// Note this ensures the window is visible and focused
export async function openDefaultWindow() {
  let window = getDefaultWindow();

  if (window === undefined) {
    window = await createMainWindow();
  } else if (window.isMinimized()) {
    window.restore();
  } else {
    window.show();
  }

  return window;
}

// Opens the developer tools for a window
// Note the focused window is specified by default
export function openDevTools(window = getFocusedWindow()) {
  window?.webContents.openDevTools({ mode: "detach" });
}

// Toggles the developer tools for a window
// Note the focused window is specified by default
export function toggleDevTools(window = getFocusedWindow()) {
  window?.webContents.toggleDevTools();
}

// Toggles full screen mode for a window
// Note the focused window is specified by default
export function toggleFullScreen(window = getFocusedWindow()) {
  window?.setFullScreen(!window.isFullScreen());
}
