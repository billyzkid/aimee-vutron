import { WebContents, Session, shell } from "electron";
import { URL } from "url";

// Available permissions
type Permission = Parameters<Exclude<Parameters<Session["setPermissionRequestHandler"]>[0], null>>[1];

// TODO: Add whitelisted origins and permissions
const whitelist = new Map<string, Set<Permission>>();

// Blocks non-whitelisted `window.open()` requests, et al.
// https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
function setWindowOpenHandler(webContents: WebContents) {
  webContents.setWindowOpenHandler((details) => {
    const { url } = details;
    const { origin } = new URL(url);

    if (whitelist.has(origin)) {
      shell.openExternal(url);
    } else if (import.meta.env.DEV) {
      console.warn("Blocked window from being opened.", { url, origin, details });
    }

    return { action: "deny" };
  });
}

// Blocks non-whitelisted `window.location` requests, et al.
// https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
function setWindowNavigationHandler(webContents: WebContents) {
  webContents.on("will-navigate", (event, url) => {
    const { origin } = new URL(url);

    if (!whitelist.has(origin)) {
      event.preventDefault();

      if (import.meta.env.DEV) {
        console.warn("Blocked navigation request.", { url, origin });
      }
    }
  });
}

// Blocks non-whitelisted webviews from being attached
// https://www.electronjs.org/docs/latest/tutorial/security#12-verify-webview-options-before-creation
function setWebViewAttachHandler(webContents: WebContents) {
  webContents.on("will-attach-webview", (event, webPreferences, params) => {
    const { src: url } = params;
    const { origin } = new URL(url);

    if (!whitelist.has(origin)) {
      event.preventDefault();

      if (import.meta.env.DEV) {
        console.warn("Blocked webview from being attached.", { url, origin, params });
      }
    }
  });
}

// Denies non-whitelisted permission requests
// https://www.electronjs.org/docs/latest/tutorial/security#5-handle-session-permission-requests-from-remote-content
function setPermissionRequestHandler(webContents: WebContents) {
  webContents.session.setPermissionRequestHandler((webContents, permission, callback, details) => {
    const url = webContents.getURL();
    const { origin } = new URL(url);

    const permissionGranted = !!whitelist.get(origin)?.has(permission);
    callback(permissionGranted);

    if (!permissionGranted && import.meta.env.DEV) {
      console.warn("Denied permission request.", { url, origin, permission, details });
    }
  });
}

// Attaches security handlers to created web contents
export function secureWebContents(webContents: WebContents) {
  setWindowOpenHandler(webContents);
  setWindowNavigationHandler(webContents);
  setWebViewAttachHandler(webContents);
  setPermissionRequestHandler(webContents);
}
