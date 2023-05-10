import { BrowserWindow, ipcMain, shell } from "electron";

export function initializeIpc(window: BrowserWindow) {
  // Get application version
  ipcMain.on("msgRequestGetVersion", () => {
    window.webContents.send("msgReceivedVersion", import.meta.env.VITE_APP_VERSION);
  });

  // Open url via web browser
  ipcMain.on("msgOpenExternalLink", async (event, url: string) => {
    await shell.openExternal(url);
  });
}
