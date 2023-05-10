import { contextBridge, ipcRenderer } from "electron";

// Whitelist of valid channels used for IPC communication (Send message from Renderer to Main)
const mainAvailChannels: string[] = ["msgRequestGetVersion", "msgOpenExternalLink"];
const rendererAvailChannels: string[] = ["msgReceivedVersion"];

contextBridge.exposeInMainWorld("mainApi", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send: (channel: string, ...data: any[]): void => {
    if (mainAvailChannels.includes(channel)) {
      ipcRenderer.send.apply(null, [channel, ...data]);
    } else {
      throw new Error(`Send failed: Unknown ipc channel name: ${channel}`);
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receive: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.on(channel, listener);
    } else {
      throw new Error(`Receive failed: Unknown ipc channel name: ${channel}`);
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoke: async (channel: string, ...data: any[]): Promise<any> => {
    if (mainAvailChannels.includes(channel)) {
      const result = await ipcRenderer.invoke.apply(null, [channel, ...data]);
      return result;
    }
    throw new Error(`Invoke failed: Unknown ipc channel name: ${channel}`);
  }
});
