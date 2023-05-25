import { Menu, globalShortcut } from "electron";
import { toggleDevTools, toggleFullScreen } from "./windows";
import * as constants from "./constants";

// Suppresses the default application menu
export function suppressDefaultMenu() {
  Menu.setApplicationMenu(null);
}

// Replaces the default application menu
export function replaceDefaultMenu() {
  const menu = Menu.buildFromTemplate(<Electron.MenuItemConstructorOptions[]>[
    {
      role: "appMenu",
      submenu: [{ role: "quit" }]
    },
    {
      role: "fileMenu",
      submenu: [{ role: "close" }]
    },
    {
      role: "viewMenu",
      submenu: [{ role: "toggleDevTools" }, { type: "separator" }, { role: "toggleFullScreen" }]
    }
  ]);

  Menu.setApplicationMenu(menu);
}

// Registers global shortcuts when the default application menu is suppressed
// Note this cannot be called before the app is ready
export function registerGlobalShortcuts() {
  globalShortcut.register(constants.PLATFORM_MAC ? "Alt+Command+I" : "Control+Shift+I", toggleDevTools);
  globalShortcut.register(constants.PLATFORM_MAC ? "Control+Command+F" : "F11", toggleFullScreen);
}
