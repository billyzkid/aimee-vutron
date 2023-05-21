import { session, app, net, LoadExtensionOptions } from "electron";
import * as fs from "fs";
import * as path from "path";
import unzip from "unzip-crx-3";

// ID used to install the Vue Devtools Extension
// https://devtools.vuejs.org
export const VUE_DEVTOOLS_EXTENSION_ID = "nhdogjmejiglipccpnnnanhbledajbpd";

// Installs a Chrome extension for the app
// Note this cannot be called before the app ready event
export async function installExtension(extensionId: string, force?: false, options?: LoadExtensionOptions) {
  let extension = session.defaultSession.getExtension(extensionId);

  if (extension && force) {
    session.defaultSession.removeExtension(extension.id);
  }

  if (!extension || force) {
    const extensionPath = await downloadExtension(extensionId);
    extension = await session.defaultSession.loadExtension(extensionPath, options);
  }

  return extension;
}

async function downloadExtension(extensionId: string) {
  const userDataPath = app.getPath("userData");
  const extensionsPath = path.join(userDataPath, "Extensions");

  // Ensure the extensions folder exists
  await fs.promises.mkdir(extensionsPath, { recursive: true });

  // Ensure the existing extension is removed
  const extensionPath = path.join(extensionsPath, extensionId);
  await fs.promises.rm(extensionPath, { recursive: true, force: true });

  const chromeVersion = process.versions.chrome || 32;
  const extensionUrl = `https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${extensionId}%26uc&prodversion=${chromeVersion}`;
  const extensionFile = `${extensionPath}.crx`;

  // Download and unzip the extension file
  await downloadFile(extensionUrl, extensionFile);
  await unzip(extensionFile, extensionPath);

  return extensionPath;
}

function downloadFile(url: string, dest: string) {
  return new Promise((resolve, reject) => {
    const request = net.request(url);

    // Write the response to the destination file
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request.on("response", (response: any) => {
      response.pipe(fs.createWriteStream(dest));
      response.on("error", reject);
      response.on("close", resolve);
    });

    request.on("error", reject);
    request.end();
  });
}
