import { fireEvent, render, screen } from "@testing-library/react";
import { format } from "util";
import App from "./App";
import translations from "./components/Translation";

let reactWarnings;

const summarizeWarning = (args) => {
  const lines = format(...args).split("\n");
  const source = lines.find((line) => line.includes("src/components/"));
  return [lines[0].trim(), source?.trim()].filter(Boolean).join("  <-  ");
};

beforeEach(() => {
  reactWarnings = [];
  jest
    .spyOn(console, "error")
    .mockImplementation((...args) => reactWarnings.push(summarizeWarning(args)));
});

afterEach(() => {
  console.error.mockRestore();
});

const expectCleanPage = () => {
  expect(document.body.textContent).not.toMatch(/undefined|\[object Object\]/);
  expect(reactWarnings).toEqual([]);
};

test("renders the English page without React warnings", () => {
  render(<App />);

  expect(
    screen.getAllByText(translations.en.header.participate).length,
  ).toBeGreaterThan(0);
  expectCleanPage();
});

test("switches to Traditional Chinese without React warnings", () => {
  render(<App />);

  fireEvent.click(screen.getAllByText("繁")[0]);

  expect(
    screen.getAllByText(translations.zh.header.participate).length,
  ).toBeGreaterThan(0);
  expectCleanPage();
});
