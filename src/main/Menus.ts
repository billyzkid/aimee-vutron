import { systemPreferences } from "electron";

export function macOSDisableDefaultMenuItem() {
  if (process.platform === "darwin") {
    systemPreferences.setUserDefault("NSDisabledDictationMenuItem", "boolean", true);
    systemPreferences.setUserDefault("NSDisabledCharacterPaletteMenuItem", "boolean", true);
  }
}
