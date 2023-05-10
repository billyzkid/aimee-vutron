import { MainApi } from "@/preload";

declare global {
  interface Window {
    mainApi: MainApi;
  }
}
