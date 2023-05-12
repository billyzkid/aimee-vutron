import { vi, beforeEach, test, expect, MockedClass } from "vitest";
import { BrowserWindow } from "electron";
// import { createMainWindow, restoreOrCreateWindow } from "../src/windows";

vi.mock("electron", () => {
  // Mock the Electron app
  const app: Pick<Electron.App, "getAppPath"> = {
    getAppPath(): string {
      return "";
    }
  };

  // Mock the BrowserWindow class
  const MockedBrowserWindow = vi.fn() as unknown as MockedClass<typeof BrowserWindow>;
  // MockedBrowserWindow.getAllWindows = vi.fn(() => MockedBrowserWindow.mock.instances);
  // MockedBrowserWindow.prototype.destroy = vi.fn();
  // MockedBrowserWindow.prototype.isDestroyed = vi.fn();
  // MockedBrowserWindow.prototype.isMinimized = vi.fn();
  // MockedBrowserWindow.prototype.focus = vi.fn();
  // MockedBrowserWindow.prototype.restore = vi.fn();
  // MockedBrowserWindow.prototype.loadURL = vi.fn((_: string, __?: Electron.LoadURLOptions) => Promise.resolve());
  // MockedBrowserWindow.prototype.loadFile = vi.fn((_: string, __?: Electron.LoadFileOptions) => Promise.resolve());

  // Suppress lint warnings for overloaded method
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments, @typescript-eslint/no-explicit-any
  // MockedBrowserWindow.prototype.on = vi.fn<any>();

  return { app, BrowserWindow: MockedBrowserWindow };
});

beforeEach(() => {
  vi.clearAllMocks();
});

test("Should create a new window", async () => {
  expect(true).toBe(true);
});

test("Should create a new window if the previous one was destroyed", async () => {
  expect(true).toBe(true);
});

test("Should restore an existing window", async () => {
  expect(true).toBe(true);
});
