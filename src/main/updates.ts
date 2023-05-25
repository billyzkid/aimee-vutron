// Checks for an application update and installs it when the app exits
// https://www.electron.build/auto-update
export default async function checkForUpdate() {
  const { autoUpdater } = await import("electron-updater");

  autoUpdater.logger = console;

  autoUpdater.on("checking-for-update", () => {
    console.log("Checking for update...");
  });

  autoUpdater.on("update-available", (...args) => {
    console.log("Update available.", { ...args });
  });

  autoUpdater.on("update-not-available", (...args) => {
    console.log("Update not available.", { ...args });
  });

  autoUpdater.on("download-progress", (...args) => {
    console.log("Update downloading...", { ...args });
  });

  autoUpdater.on("update-cancelled", (...args) => {
    console.log("Update cancelled.", { ...args });
  });

  autoUpdater.on("update-downloaded", (...args) => {
    console.log("Update downloaded.", { ...args });
  });

  autoUpdater.on("error", (...args) => {
    console.error("Update failed.", { ...args });
  });

  return await autoUpdater.checkForUpdatesAndNotify();
}
