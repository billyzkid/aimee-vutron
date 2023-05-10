export function getCurrentLocale(): string {
  return navigator?.language?.split("-")[0] || "en";
}

export function openExternal(url: string): Promise<void> {
  return window.mainApi.send("msgOpenExternalLink", url);
}
