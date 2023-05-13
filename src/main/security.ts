import { Session, app, shell } from "electron";
import { URL } from "url";

type Permission = Parameters<Exclude<Parameters<Session["setPermissionRequestHandler"]>[0], null>>[1];

const ALLOWED_ORIGINS_AND_PERMISSIONS = new Map<string, Set<Permission>>(
  import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? [[new URL(import.meta.env.VITE_DEV_SERVER_URL).origin, new Set()]]
    : []
);

const ALLOWED_EXTERNAL_ORIGINS = new Set<`https://${string}`>(["https://github.com"]);

app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, url) => {
    const { origin } = new URL(url);

    if (!ALLOWED_ORIGINS_AND_PERMISSIONS.has(origin)) {
      if (import.meta.env.DEV) {
        console.warn(`Blocked navigation to disallowed origin "${origin}".`);
      }

      event.preventDefault();
    }
  });

  contents.on("will-attach-webview", (event, webPreferences, params) => {
    const { origin } = new URL(params.src);

    if (!ALLOWED_ORIGINS_AND_PERMISSIONS.has(origin)) {
      if (import.meta.env.DEV) {
        console.warn(`Blocked WebView from attaching source "${params.src}" from disallowed origin "${origin}".`);
      }

      event.preventDefault();
    } else {
      delete webPreferences.preload;

      webPreferences.nodeIntegration = false;
      webPreferences.contextIsolation = true;
    }
  });

  contents.setWindowOpenHandler((details) => {
    const { origin } = new URL(details.url);

    if (!ALLOWED_EXTERNAL_ORIGINS.has(origin as `https://${string}`)) {
      if (import.meta.env.DEV) {
        console.warn(`Blocked window from opening URL "${details.url}" from disallowed origin "${origin}".`);
      }
    } else {
      shell.openExternal(details.url).catch(console.error);
    }

    return { action: "deny" };
  });

  contents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    const { origin } = new URL(webContents.getURL());

    const permissionGranted = !!ALLOWED_ORIGINS_AND_PERMISSIONS.get(origin)?.has(permission);
    callback(permissionGranted);

    if (!permissionGranted && import.meta.env.DEV) {
      console.warn(`Denied permission "${permission}" request from disallowed origin "${origin}".`);
    }
  });
});
