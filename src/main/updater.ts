import { autoUpdater } from "electron-updater";

autoUpdater.logger = console;

autoUpdater.on("checking-for-update", () => {
  console.log("Checking for update...");
});

autoUpdater.on("update-available", (info) => {
  console.log("Update available.", info);
});

autoUpdater.on("update-not-available", (info) => {
  console.log("Update not available.", info);
});

autoUpdater.on("download-progress", (info) => {
  console.log("Update downloading...", info);
});

autoUpdater.on("update-cancelled", (info) => {
  console.log("Update cancelled.", info);
});

autoUpdater.on("update-downloaded", (event) => {
  console.log("Update downloaded.", event);
});

autoUpdater.on("error", (error) => {
  console.error("Update failed.", error);
});

// Detects app updates and installs them when the app exits
// https://www.electron.build/auto-update
export function checkForUpdates() {
  return autoUpdater.checkForUpdatesAndNotify();
}
