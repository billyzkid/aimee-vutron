import { vi, test, expect, beforeEach, MockedClass } from "vitest";
import { BrowserWindow } from "electron";
import { openMainWindow } from "../src/main/windows";

vi.mock("electron", () => {
  // Mock the BrowserWindow type
  const MockedBrowserWindow = vi.fn() as unknown as MockedClass<typeof BrowserWindow>;
  MockedBrowserWindow.getAllWindows = vi.fn(() => MockedBrowserWindow.mock.instances);
  MockedBrowserWindow.prototype.setMenuBarVisibility = vi.fn();
  MockedBrowserWindow.prototype.on = vi.fn().mockReturnThis();
  MockedBrowserWindow.prototype.loadURL = vi.fn().mockReturnValue(Promise.resolve());
  MockedBrowserWindow.prototype.loadFile = vi.fn().mockReturnValue(Promise.resolve());
  MockedBrowserWindow.prototype.isDestroyed = vi.fn();
  MockedBrowserWindow.prototype.isMinimized = vi.fn();
  MockedBrowserWindow.prototype.restore = vi.fn();
  MockedBrowserWindow.prototype.focus = vi.fn();

  // Mock ipcMain
  const ipcMain = {
    on: vi.fn().mockReturnThis()
  };

  return { BrowserWindow: MockedBrowserWindow, ipcMain };
});

beforeEach(() => {
  vi.clearAllMocks();
});

test("Should create a new window", async () => {
  const { mock } = vi.mocked(BrowserWindow);
  expect(mock.instances).toHaveLength(0);

  // Create a window
  await openMainWindow();
  expect(mock.instances).toHaveLength(1);

  // Ensure the content was loaded
  const window = vi.mocked(mock.instances[0]);
  expect(window.loadURL.mock.calls.length + window.loadFile.mock.calls.length).toBe(1);

  if (window.loadURL.mock.calls.length === 1) {
    expect(window.loadURL).toHaveBeenCalledWith(expect.stringMatching(/index\.html$/));
  } else {
    expect(window.loadFile).toHaveBeenCalledWith(expect.stringMatching(/index\.html$/));
  }
});

test("Should create a new window if the previous one was destroyed", async () => {
  const { mock } = vi.mocked(BrowserWindow);
  expect(mock.instances).toHaveLength(0);

  // Create a window
  await openMainWindow();
  expect(mock.instances).toHaveLength(1);

  // Destroy the window
  const window = vi.mocked(mock.instances[0]);
  window.isDestroyed.mockReturnValueOnce(true);

  // Create another window
  await openMainWindow();
  expect(mock.instances).toHaveLength(2);
});

test("Should restore an existing window", async () => {
  const { mock } = vi.mocked(BrowserWindow);
  expect(mock.instances).toHaveLength(0);

  // Create a window
  await openMainWindow();
  expect(mock.instances).toHaveLength(1);

  // Minimize the window
  const window = vi.mocked(mock.instances[0]);
  window.isMinimized.mockReturnValueOnce(true);

  // Restore the window
  await openMainWindow();
  expect(mock.instances).toHaveLength(1);
  expect(window.restore).toHaveBeenCalledOnce();
});
