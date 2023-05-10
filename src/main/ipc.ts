import { BrowserWindow, ipcMain, shell } from "electron";
import * as constants from "./constants";

export function initializeIpc(window: BrowserWindow) {
  // Get application version
  ipcMain.on("msgRequestGetVersion", () => {
    window.webContents.send("msgReceivedVersion", constants.APP_VERSION);
  });

  // Open url via web browser
  ipcMain.on("msgOpenExternalLink", async (event, url: string) => {
    await shell.openExternal(url);
  });
}
