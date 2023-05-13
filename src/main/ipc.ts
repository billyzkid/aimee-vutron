import { ipcMain, app, shell } from "electron";

ipcMain.handle("get-locale", () => app.getLocale());

ipcMain.handle("open-external-url", (_, url: string) => shell.openExternal(url));
