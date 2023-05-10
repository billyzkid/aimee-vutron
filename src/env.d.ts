/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_DEV_SERVER_URL: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
