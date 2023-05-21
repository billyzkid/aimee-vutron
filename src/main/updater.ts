import { autoUpdater as updater } from "electron-updater";

updater.logger = console;

//updater.autoDownload = false;
//updater.autoInstallOnAppQuit = false;
//updater.autoRunAppAfterInstall = false;

console.log(`updater.autoDownload = ${updater.autoDownload}`);
console.log(`updater.autoInstallOnAppQuit = ${updater.autoInstallOnAppQuit}`);
console.log(`updater.autoRunAppAfterInstall = ${updater.autoRunAppAfterInstall}`);

updater.on("checking-for-update", () => {
  console.log("Checking for update...");
});

updater.on("update-available", (info) => {
  console.log("Update available.", info);
});

updater.on("update-not-available", (info) => {
  console.log("Update not available.", info);
});

updater.on("download-progress", (info) => {
  console.log("Update downloading...", info);
});

updater.on("update-cancelled", (info) => {
  console.log("Update cancelled.", info);
});

updater.on("update-downloaded", (event) => {
  console.log("Update downloaded.", event);
});

updater.on("error", (error, message) => {
  console.log("Update failed.", error, message);
});

// Attempts to detect and install app updates
// https://www.electron.build/auto-update.html#quick-setup-guide
// https://github.com/iffy/electron-updater-example
export async function checkForUpdates() {
  try {
    await updater.checkForUpdatesAndNotify();
    //await autoUpdater.checkForUpdates();
    //autoUpdater.quitAndInstall();
  } catch (x) {
    console.error("Failed to install app updates.", x);
  }
}
