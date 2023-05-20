import { vi, test, expect, afterEach, MockedClass } from "vitest";
import { BrowserWindow, Menu } from "electron";
import { openMainWindow } from "../src/main/windows";

vi.mock("electron", () => {
  // Mock the BrowserWindow class
  const MockedBrowserWindow = vi.fn() as unknown as MockedClass<typeof BrowserWindow>;
  MockedBrowserWindow.getAllWindows = vi.fn(() => MockedBrowserWindow.mock.instances);
  MockedBrowserWindow.prototype.on = vi.fn().mockReturnThis();
  MockedBrowserWindow.prototype.loadURL = vi.fn();
  MockedBrowserWindow.prototype.loadFile = vi.fn();
  MockedBrowserWindow.prototype.isDestroyed = vi.fn();
  MockedBrowserWindow.prototype.isMinimized = vi.fn();
  MockedBrowserWindow.prototype.isFocused = vi.fn();
  MockedBrowserWindow.prototype.restore = vi.fn();
  MockedBrowserWindow.prototype.focus = vi.fn();

  // Mock the Menu class
  const MockedMenu = vi.fn() as unknown as MockedClass<typeof Menu>;
  MockedMenu.setApplicationMenu = vi.fn();

  return {
    BrowserWindow: MockedBrowserWindow,
    Menu: MockedMenu
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

test("Should suppress the default menu", async () => {
  const { setApplicationMenu } = vi.mocked(Menu);
  expect(setApplicationMenu).toHaveBeenCalledOnce();
  expect(setApplicationMenu).toHaveBeenCalledWith(null);
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

test("Should restore the existing window", async () => {
  const { mock } = vi.mocked(BrowserWindow);
  expect(mock.instances).toHaveLength(0);

  // Create a window
  await openMainWindow();
  expect(mock.instances).toHaveLength(1);

  // Ensure the window is minimized
  const window = vi.mocked(mock.instances[0]);
  window.isMinimized.mockReturnValueOnce(true);

  // Open the window
  await openMainWindow();
  expect(mock.instances).toHaveLength(1);
  expect(window.restore).toHaveBeenCalledOnce();
  expect(window.focus).not.toHaveBeenCalled();
});

test("Should give focus to the existing window", async () => {
  const { mock } = vi.mocked(BrowserWindow);
  expect(mock.instances).toHaveLength(0);

  // Create a window
  await openMainWindow();
  expect(mock.instances).toHaveLength(1);

  // Ensure the window is not minimized or focused
  const window = vi.mocked(mock.instances[0]);
  window.isMinimized.mockReturnValueOnce(false);
  window.isFocused.mockReturnValueOnce(false);

  // Open the window
  await openMainWindow();
  expect(mock.instances).toHaveLength(1);
  expect(window.focus).toHaveBeenCalledOnce();
  expect(window.restore).not.toHaveBeenCalled();
});
