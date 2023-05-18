import { ipcMain, app, shell } from "electron";

ipcMain.handle("get-locale", () => {
  return app.getLocale();
});

ipcMain.handle("open-external-url", (event, url: string) => {
  return shell.openExternal(url);
});
