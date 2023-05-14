import { contextBridge, ipcRenderer } from "electron";

const mainApi: MainApi = {
  getLocale: () => ipcRenderer.invoke("get-locale"),
  openExternalUrl: (url) => ipcRenderer.invoke("open-external-url", url)
};

// Expose the main API to the renderer process
contextBridge.exposeInMainWorld("mainApi", mainApi);
