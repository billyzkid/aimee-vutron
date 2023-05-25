import { app, session, net } from "electron";
import unzip from "unzip-crx-3";
import * as fs from "fs";
import * as path from "path";

const DOWNLOAD_URL = `https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx3&x=id%3D[EXTENSION_ID]%26uc&prodversion=${process.versions.chrome}`;
const DOWNLOAD_FILE = path.join(app.getPath("temp"), "[EXTENSION_ID].crx");
const INSTALL_PATH = path.join(app.getPath("userData"), "Extensions\\[EXTENSION_ID]");

const getDownloadUrl = (extensionId: string) => DOWNLOAD_URL.replace("[EXTENSION_ID]", extensionId);
const getDownloadFile = (extensionId: string) => DOWNLOAD_FILE.replace("[EXTENSION_ID]", extensionId);
const getInstallPath = (extensionId: string) => INSTALL_PATH.replace("[EXTENSION_ID]", extensionId);

// Loads a Chrome extension, downloading and installing it if necessary
// Note this cannot be called before the app is ready
export default async function loadExtension(extensionId: string, options: LoadExtensionOptions = {}) {
  const { force = false, allowFileAccess = false } = options;

  if (isExtensionLoaded(extensionId)) {
    unloadExtension(extensionId);
  }

  if (force && isExtensionInstalled(extensionId)) {
    await uninstallExtension(extensionId);
  }

  if (force || !isExtensionInstalled(extensionId)) {
    await installExtension(extensionId);
  }

  return await loadExtensionInternal(extensionId, { allowFileAccess });
}

function isExtensionInstalled(extensionId: string) {
  return fs.existsSync(getInstallPath(extensionId));
}

function isExtensionLoaded(extensionId: string) {
  return !!session.defaultSession.getExtension(extensionId);
}

async function installExtension(extensionId: string) {
  const downloadUrl = getDownloadUrl(extensionId);
  const downloadFile = getDownloadFile(extensionId);
  const installPath = getInstallPath(extensionId);

  await download(downloadUrl, downloadFile);
  await unzip(downloadFile, installPath);
  await fs.promises.rm(downloadFile);

  return installPath;
}

function uninstallExtension(extensionId: string) {
  return fs.promises.rm(getInstallPath(extensionId), { recursive: true, force: true });
}

function loadExtensionInternal(extensionId: string, options?: Electron.LoadExtensionOptions) {
  return session.defaultSession.loadExtension(getInstallPath(extensionId), options);
}

function unloadExtension(extensionId: string) {
  session.defaultSession.removeExtension(extensionId);
}

function download(url: string, file: string) {
  return new Promise<void>((resolve, reject) => {
    const request = net.request(url);

    // Resolve the promise if the response is successfully
    // written to the destination file, otherwise reject it
    request.on("response", (response) => {
      const readStream = response as unknown as NodeJS.ReadableStream;
      const writeStream = fs.createWriteStream(file);

      readStream.pipe(writeStream);
      writeStream.on("error", reject);
      writeStream.on("finish", resolve);
    });

    // Reject the promise if the request fails
    request.on("error", reject);

    // Send the request
    request.end();
  });
}
