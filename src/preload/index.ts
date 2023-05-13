import { contextBridge, ipcRenderer } from "electron";

// Whitelist of valid IPC channels used to send messages from renderer to main process
const mainAvailChannels: string[] = ["msgRequestGetVersion", "msgRequestGetLocale", "msgOpenExternalLink"];
const rendererAvailChannels: string[] = ["msgReceivedVersion", "msgReceivedLocale"];

export interface MainApi {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoke: (channel: string, ...data: any[]) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send: (channel: string, ...data: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receive: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
}

const mainApi: MainApi = {
  invoke: (channel, ...data) => {
    if (mainAvailChannels.includes(channel)) {
      return ipcRenderer.invoke.apply(null, [channel, ...data]);
    } else {
      throw new Error(`Invoke failed: Unknown IPC channel "${channel}".`);
    }
  },
  send: (channel, ...data) => {
    if (mainAvailChannels.includes(channel)) {
      ipcRenderer.send.apply(null, [channel, ...data]);
    } else {
      throw new Error(`Send failed: Unknown IPC channel "${channel}".`);
    }
  },
  receive: (channel, listener) => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.on(channel, listener);
    } else {
      throw new Error(`Receive failed: Unknown IPC channel "${channel}".`);
    }
  }
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld("mainApi", mainApi);
