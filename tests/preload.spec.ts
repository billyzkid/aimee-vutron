import { vi, test, expect, beforeEach } from "vitest";
import { contextBridge, ipcRenderer } from "electron";

vi.mock("electron", () => ({
  contextBridge: {
    exposeInMainWorld: vi.fn()
  },
  ipcRenderer: {
    invoke: vi.fn()
  }
}));

beforeEach(() => {
  vi.resetAllMocks();
  vi.resetModules();
});

test("Should expose main API", async () => {
  await import("../src/preload");

  const { exposeInMainWorld } = vi.mocked(contextBridge);
  expect(exposeInMainWorld).toHaveBeenCalledOnce();

  const apiKey = exposeInMainWorld.mock.calls[0][0];
  const api = exposeInMainWorld.mock.calls[0][1];

  expect(apiKey).toBe("mainApi");
  expect(api).toMatchObject({
    getLocale: expect.any(Function),
    openExternalUrl: expect.any(Function)
  });
});

test("Should invoke get-locale", async () => {
  await import("../src/preload");

  const { invoke } = vi.mocked(ipcRenderer);
  invoke.mockReturnValueOnce(Promise.resolve("en-US"));

  const mainApi = vi.mocked(contextBridge).exposeInMainWorld.mock.calls[0][1] as MainApi;
  const returnValue = mainApi.getLocale();

  expect(invoke).toHaveBeenCalledOnce();
  expect(invoke).toHaveBeenCalledWith("get-locale");
  expect(returnValue).resolves.toBe("en-US");
});

test("Should invoke open-external-url", async () => {
  await import("../src/preload");

  const { invoke } = vi.mocked(ipcRenderer);
  invoke.mockReturnValueOnce(Promise.resolve());

  const mainApi = vi.mocked(contextBridge).exposeInMainWorld.mock.calls[0][1] as MainApi;
  const returnValue = mainApi.openExternalUrl("http://github.com");

  expect(invoke).toHaveBeenCalledOnce();
  expect(invoke).toHaveBeenCalledWith("open-external-url", "http://github.com");
  expect(returnValue).resolves.toBeUndefined();
});
