/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_DEV_SERVER_URL: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface MainApi {
  getLocale(): Promise<string>;
  openExternalUrl(url: string): Promise<void>;
}

interface LoadExtensionOptions extends Electron.LoadExtensionOptions {
  force?: boolean;
  allowFileAccess?: boolean;
}

type Permission = Parameters<Exclude<Parameters<Electron.Session["setPermissionRequestHandler"]>[0], null>>[1];
