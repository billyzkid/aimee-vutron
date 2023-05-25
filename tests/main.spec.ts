import { vi, describe, test, expect, afterEach, MockedClass } from "vitest";
import { BrowserWindow } from "electron";
import { createMainWindow, openDefaultWindow } from "../src/main/windows";
import * as path from "path";

vi.mock("electron", () => {
  // Mock the BrowserWindow class
  const MockedBrowserWindow = vi.fn() as unknown as MockedClass<typeof BrowserWindow>;
  MockedBrowserWindow.getAllWindows = vi.fn(() => MockedBrowserWindow.mock.instances);
  MockedBrowserWindow.prototype.once = vi.fn().mockReturnThis();
  MockedBrowserWindow.prototype.loadURL = vi.fn();
  MockedBrowserWindow.prototype.loadFile = vi.fn();
  MockedBrowserWindow.prototype.isDestroyed = vi.fn();
  MockedBrowserWindow.prototype.isMinimized = vi.fn();
  MockedBrowserWindow.prototype.restore = vi.fn();
  MockedBrowserWindow.prototype.show = vi.fn();

  return {
    BrowserWindow: MockedBrowserWindow
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("createMainWindow", () => {
  test("Should create main window instances", async () => {
    const { mock } = vi.mocked(BrowserWindow);
    expect(mock.instances).toHaveLength(0);

    await createMainWindow();
    await createMainWindow();
    await createMainWindow();

    expect(mock.instances).toHaveLength(3);
  });

  test("Should load the expected page", async () => {
    const { mock } = vi.mocked(BrowserWindow);
    expect(mock.instances).toHaveLength(0);

    await createMainWindow();
    expect(mock.instances).toHaveLength(1);

    const window = vi.mocked(mock.instances[0]);

    if (import.meta.env.VITE_DEV_SERVER_URL !== undefined) {
      expect(window.loadURL).toHaveBeenCalledOnce();
      expect(window.loadURL).toHaveBeenCalledWith(import.meta.env.VITE_DEV_SERVER_URL);
    } else {
      expect(window.loadFile).toHaveBeenCalledOnce();
      expect(window.loadFile).toHaveBeenCalledWith(path.resolve("./src/renderer/index.html"));
    }
  });
});

describe("openDefaultWindow", () => {
  test("Should create a new window if no others exist", async () => {
    const { mock } = vi.mocked(BrowserWindow);
    expect(mock.instances).toHaveLength(0);

    await openDefaultWindow();
    expect(mock.instances).toHaveLength(1);
  });

  test("Should create a new window if existing ones are destroyed", async () => {
    const { mock } = vi.mocked(BrowserWindow);
    expect(mock.instances).toHaveLength(0);

    await createMainWindow();
    expect(mock.instances).toHaveLength(1);

    const window = vi.mocked(mock.instances[0]);
    window.isDestroyed.mockReturnValueOnce(true);

    await openDefaultWindow();
    expect(mock.instances).toHaveLength(2);
  });

  test("Should restore an existing window if it is minimized", async () => {
    const { mock } = vi.mocked(BrowserWindow);
    expect(mock.instances).toHaveLength(0);

    await createMainWindow();
    expect(mock.instances).toHaveLength(1);

    const window = vi.mocked(mock.instances[0]);
    window.isDestroyed.mockReturnValueOnce(false);
    window.isMinimized.mockReturnValueOnce(true);

    await openDefaultWindow();
    expect(mock.instances).toHaveLength(1);
    expect(window.restore).toHaveBeenCalledOnce();
  });

  test("Should show an existing window by default", async () => {
    const { mock } = vi.mocked(BrowserWindow);
    expect(mock.instances).toHaveLength(0);

    await createMainWindow();
    expect(mock.instances).toHaveLength(1);

    const window = vi.mocked(mock.instances[0]);
    window.isDestroyed.mockReturnValueOnce(false);
    window.isMinimized.mockReturnValueOnce(false);

    await openDefaultWindow();
    expect(mock.instances).toHaveLength(1);
    expect(window.show).toHaveBeenCalledOnce();
  });
});
