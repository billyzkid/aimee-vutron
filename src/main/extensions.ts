import { session, app, net, LoadExtensionOptions } from "electron";
import * as fs from "fs";
import * as path from "path";
import unzip from "unzip-crx-3";

interface InstallExtensionOptions {
  force?: boolean;
  loadOptions?: LoadExtensionOptions;
}

// ID used to install the Vue Devtools Extension
// https://devtools.vuejs.org
export const VUE_DEVTOOLS_EXTENSION_ID = "nhdogjmejiglipccpnnnanhbledajbpd";

// Installs a Chrome extension for the app
// Note this cannot be called before the app ready event
export async function installExtension(extensionId: string, options: InstallExtensionOptions = {}) {
  const { force, loadOptions } = options;

  let extension = session.defaultSession.getExtension(extensionId);

  if (extension && force) {
    session.defaultSession.removeExtension(extensionId);
  }

  if (!extension || force) {
    const extensionPath = await downloadExtension(extensionId);
    extension = await session.defaultSession.loadExtension(extensionPath, loadOptions);
  }

  return extension;
}

// Downloads a Chrome extension for the app
async function downloadExtension(extensionId: string) {
  const extensionCrxUrl = `https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${extensionId}%26uc&prodversion=${process.versions.chrome}`;
  const extensionCrxFile = path.join(app.getPath("temp"), extensionId);
  const extensionPath = path.join(app.getPath("userData"), "Extensions", extensionId);

  // Download and unzip the extension file
  await downloadFile(extensionCrxUrl, extensionCrxFile);
  await unzip(extensionCrxFile, extensionPath);

  return extensionPath;
}

// Downloads a URL to the specified destination file
function downloadFile(url: string, file: string) {
  return new Promise((resolve, reject) => {
    const request = net.request(url);

    // Reject the promise if the request fails
    request.on("error", reject);

    // Attempt to write the response to the destination file
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request.on("response", (response: any) => {
      response.on("error", reject);
      response.on("close", resolve);
      response.pipe(fs.createWriteStream(file));
    });

    // Send the request
    request.end();
  });
}
