import * as path from "path";
import { productName, version } from "../../package.json";

export const APP_NAME = productName;
export const APP_VERSION = version;

export const APP_INDEX_URL_DEV = "http://localhost:5173/index.html";
export const APP_INDEX_URL_PROD = path.join(__dirname, "../index.html");

export const IS_MAC = process.platform === "darwin";
export const IS_DEV = process.env.NODE_ENV === "development";

export const DEFAULT_WEB_PREFERENCES = {
  nodeIntegration: false,
  contextIsolation: true,
  enableRemoteModule: false,
  preload: path.join(__dirname, "../preload/index.js")
};
