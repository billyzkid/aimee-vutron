export const PLATFORM_WIN = process.platform === "win32";
export const PLATFORM_MAC = process.platform === "darwin";
export const PLATFORM_LINUX = process.platform === "linux";
export const PLATFORM_OTHER = !PLATFORM_WIN && !PLATFORM_MAC && !PLATFORM_LINUX;

export const MAIN_WINDOW_TITLE = import.meta.env.VITE_APP_TITLE;
export const MAIN_WINDOW_WIDTH = 1200;
export const MAIN_WINDOW_HEIGHT = 600;

// https://devtools.vuejs.org
export const VUE_DEVTOOLS_EXTENSION_ID = "nhdogjmejiglipccpnnnanhbledajbpd";
