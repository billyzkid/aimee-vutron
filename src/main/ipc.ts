import { BrowserWindow, ipcMain, shell, app } from "electron";

export function initializeIpc(window: BrowserWindow) {
  // Get application version
  ipcMain.on("msgRequestGetVersion", () => {
    window.webContents.send("msgReceivedVersion", import.meta.env.VITE_APP_VERSION);
  });

  // Get application locale
  ipcMain.on("msgRequestGetLocale", () => {
    window.webContents.send("msgReceivedLocale", app.getLocale().split("-")[0]);
  });

  // Open url via web browser
  ipcMain.on("msgOpenExternalLink", async (event, url: string) => {
    await shell.openExternal(url);
  });
}
