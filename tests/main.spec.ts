import { vi, test, expect, afterEach, MockedClass } from "vitest";
import { Menu, BrowserWindow } from "electron";
import { createMainWindow, openMainWindow } from "../src/main/windows";

vi.mock("electron", () => {
  // Mock the Menu class
  const MockedMenu = vi.fn() as unknown as MockedClass<typeof Menu>;
  MockedMenu.setApplicationMenu = vi.fn();

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

  // Mock the WebContents class
  const MockedWebContents = vi.fn() as unknown as MockedClass<typeof Electron.WebContents>;
  MockedWebContents.prototype.openDevTools = vi.fn();

  Object.defineProperty(MockedBrowserWindow.prototype, "webContents", { value: new MockedWebContents() });

  return {
    Menu: MockedMenu,
    BrowserWindow: MockedBrowserWindow
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

test("Should suppress the default application menu", async () => {
  const { setApplicationMenu } = vi.mocked(Menu);

  expect(setApplicationMenu).toHaveBeenCalledOnce();
  expect(setApplicationMenu).toHaveBeenCalledWith(null);
});

test("Should create and initialize a new window", async () => {
  const { mock } = vi.mocked(BrowserWindow);
  expect(mock.instances).toHaveLength(0);

  // Create a window
  await createMainWindow();
  expect(mock.instances).toHaveLength(1);

  const window = vi.mocked(mock.instances[0]);

  // Ensure the devtools were opened in development only
  if (import.meta.env.DEV) {
    expect(window.webContents.openDevTools).toHaveBeenCalledOnce();
  } else {
    expect(window.webContents.openDevTools).not.toHaveBeenCalled();
  }

  // Ensure the content was loaded properly
  if (import.meta.env.VITE_DEV_SERVER_URL !== undefined) {
    expect(window.loadURL).toHaveBeenCalledOnce();
    expect(window.loadURL).toHaveBeenCalledWith(import.meta.env.VITE_DEV_SERVER_URL);
    expect(window.loadFile).not.toHaveBeenCalled();
  } else {
    expect(window.loadFile).toHaveBeenCalledOnce();
    expect(window.loadFile).toHaveBeenCalledWith(expect.stringMatching(/index\.html$/));
    expect(window.loadURL).not.toHaveBeenCalled();
  }
});

test("Should create a new window if the existing one is destroyed", async () => {
  const { mock } = vi.mocked(BrowserWindow);
  expect(mock.instances).toHaveLength(0);

  // Create a window
  await createMainWindow();
  expect(mock.instances).toHaveLength(1);

  // Destroy the window
  const window = vi.mocked(mock.instances[0]);
  window.isDestroyed.mockReturnValueOnce(true);

  // Ensure a new window is created
  await openMainWindow();
  expect(mock.instances).toHaveLength(2);
});

test("Should restore a minimized window", async () => {
  const { mock } = vi.mocked(BrowserWindow);
  expect(mock.instances).toHaveLength(0);

  // Create a window
  await createMainWindow();
  expect(mock.instances).toHaveLength(1);

  // Minimize the window
  const window = vi.mocked(mock.instances[0]);
  window.isMinimized.mockReturnValueOnce(true);

  // Open the window
  await openMainWindow();
  expect(mock.instances).toHaveLength(1);

  // Ensure the window was restored
  expect(window.restore).toHaveBeenCalledOnce();
  expect(window.focus).not.toHaveBeenCalled();
});

test("Should give focus to an open window", async () => {
  const { mock } = vi.mocked(BrowserWindow);
  expect(mock.instances).toHaveLength(0);

  // Create a window
  await createMainWindow();
  expect(mock.instances).toHaveLength(1);

  const window = vi.mocked(mock.instances[0]);
  window.isMinimized.mockReturnValueOnce(false);
  window.isFocused.mockReturnValueOnce(false);

  // Open the window
  await openMainWindow();
  expect(mock.instances).toHaveLength(1);

  // Ensure the window was focused
  expect(window.focus).toHaveBeenCalledOnce();
  expect(window.restore).not.toHaveBeenCalled();
});
