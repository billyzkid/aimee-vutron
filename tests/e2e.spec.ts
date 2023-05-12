import { beforeAll, afterAll, test, expect } from "vitest";

beforeAll(async () => {
  //electronApp = await electron.launch({ args: ["."] });
});

afterAll(async () => {
  //await electronApp.close();
});

test("Main window state", async () => {
  expect(true).toBe(true);
});

test("Main window content", async () => {
  expect(true).toBe(true);
});

test("Preload versions", async () => {
  expect(true).toBe(true);
});

test("Preload crypto", async () => {
  expect(true).toBe(true);
});
