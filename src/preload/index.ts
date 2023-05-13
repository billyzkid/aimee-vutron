import { contextBridge, ipcRenderer } from "electron";

export interface MainApi {
  getLocale: () => Promise<string>;
  openExternalUrl: (url: string) => Promise<void>;
}

const mainApi: MainApi = {
  getLocale: () => ipcRenderer.invoke("get-locale"),
  openExternalUrl: (url) => ipcRenderer.invoke("open-external-url", url)
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld("mainApi", mainApi);
