import { systemPreferences } from "electron";
import * as constants from "./constants";

export function macOSDisableDefaultMenuItem() {
  if (constants.IS_MAC) {
    systemPreferences.setUserDefault("NSDisabledDictationMenuItem", "boolean", true);
    systemPreferences.setUserDefault("NSDisabledCharacterPaletteMenuItem", "boolean", true);
  }
}
