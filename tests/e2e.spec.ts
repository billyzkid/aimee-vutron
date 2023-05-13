import { test, expect, beforeAll, afterAll } from "vitest";
import { _electron as electron, ElectronApplication, JSHandle } from "playwright";
import { BrowserWindow } from "electron";

let electronApp: ElectronApplication;

beforeAll(async () => {
  electronApp = await electron.launch({ args: ["."] });
});

afterAll(async () => {
  await electronApp.close();
});

test("Main window state", async () => {
  const page = await electronApp.firstWindow();
  const window = (await electronApp.browserWindow(page)) as JSHandle<BrowserWindow>;

  const windowState = await window.evaluate(
    (mainWindow): Promise<{ isVisible: boolean; isDevToolsOpened: boolean; isCrashed: boolean }> => {
      const getState = () => ({
        isVisible: mainWindow.isVisible(),
        isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
        isCrashed: mainWindow.webContents.isCrashed()
      });

      return new Promise((resolve) => {
        if (mainWindow.isVisible()) {
          resolve(getState());
        } else {
          mainWindow.once("ready-to-show", () => resolve(getState()));
        }
      });
    }
  );

  expect(windowState.isVisible, "Window was not visible").toBeTruthy();
  expect(windowState.isDevToolsOpened, "DevTools was opened").toBeFalsy();
  expect(windowState.isCrashed, "Renderer process crashed").toBeFalsy();
});

test("Main window content", async () => {
  const page = await electronApp.firstWindow();
  const element = page.locator("#app");

  expect(element, "Unable to find the app root element").toBeDefined();
  expect(await element.innerHTML(), "Window content was empty").not.equal("");
});
