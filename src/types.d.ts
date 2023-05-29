/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_DEV_SERVER_URL: string | undefined;
  readonly VITE_REMOTE_DEBUGGING_PORT: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface MainApi {
  getLocale(): Promise<string>;
  openExternalUrl(url: string): Promise<void>;
}

type Permission = Parameters<Exclude<Parameters<Electron.Session["setPermissionRequestHandler"]>[0], null>>[1];
