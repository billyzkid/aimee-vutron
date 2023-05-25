import { shell } from "electron";

const whitelist = createWhitelist();

// Creates a map of whitelisted origins and permissions
function createWhitelist() {
  const map = new Map<string, Set<Permission>>();

  // Add the dev server URL to the whitelist
  if (import.meta.env.VITE_DEV_SERVER_URL !== undefined) {
    map.set(new URL(import.meta.env.VITE_DEV_SERVER_URL).origin, new Set());
  }

  return map;
}

// Blocks non-whitelisted windows from being opened
// https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
function setWindowOpenHandler(webContents: Electron.WebContents) {
  webContents.setWindowOpenHandler((details) => {
    const { origin } = new URL(details.url);

    if (whitelist.has(origin)) {
      shell.openExternal(details.url);
    } else if (import.meta.env.DEV) {
      console.warn("Blocked window from being opened.", { id: webContents.id, origin, details });
    }

    return { action: "deny" };
  });
}

// Blocks non-whitelisted webviews from being attached
// https://www.electronjs.org/docs/latest/tutorial/security#12-verify-webview-options-before-creation
function setWebViewAttachHandler(webContents: Electron.WebContents) {
  webContents.on("will-attach-webview", (event, webPreferences, params) => {
    const { origin } = new URL(params.src);

    if (!whitelist.has(origin)) {
      event.preventDefault();

      if (import.meta.env.DEV) {
        console.warn("Blocked webview from being attached.", { id: webContents.id, origin, params });
      }
    }
  });
}

// Blocks non-whitelisted navigation requests
// https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
function setNavigationRequestHandler(webContents: Electron.WebContents) {
  webContents.on("will-navigate", (event, url) => {
    const { origin } = new URL(url);

    if (!whitelist.has(origin)) {
      event.preventDefault();

      if (import.meta.env.DEV) {
        console.warn("Blocked navigation request.", { id: webContents.id, origin, url });
      }
    }
  });
}

// Denies non-whitelisted permission requests
// https://www.electronjs.org/docs/latest/tutorial/security#5-handle-session-permission-requests-from-remote-content
function setPermissionRequestHandler(webContents: Electron.WebContents) {
  webContents.session.setPermissionRequestHandler((webContents, permission, callback, details) => {
    const { origin } = new URL(details.requestingUrl);

    const permissionGranted = !!whitelist.get(origin)?.has(permission);
    callback(permissionGranted);

    if (!permissionGranted && import.meta.env.DEV) {
      console.warn("Denied permission request.", { id: webContents.id, origin, permission, details });
    }
  });
}

// Sets the default handlers for the specified web contents
export function setDefaultHandlers(webContents: Electron.WebContents) {
  setWindowOpenHandler(webContents);
  setWebViewAttachHandler(webContents);
  setNavigationRequestHandler(webContents);
  setPermissionRequestHandler(webContents);
}
