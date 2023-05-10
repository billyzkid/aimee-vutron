import { MainApi } from "../src/preload";

declare global {
  interface Window {
    mainApi: MainApi;
  }
}
