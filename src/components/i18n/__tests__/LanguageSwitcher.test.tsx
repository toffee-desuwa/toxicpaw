/**
 * Tests for LanguageSwitcher component (F019 - i18n + Chinese localization)
 *
 * Covers: rendering, toggle behavior, accessibility, locale persistence.
 */

import React from "react";
import { render, screen, act } from "@testing-library/react";
import { I18nProvider } from "@/lib/i18n";
import { LanguageSwitcher } from "../LanguageSwitcher";

function renderSwitcher(initialLocale: "en" | "zh" = "en") {
  return render(
    <I18nProvider initialLocale={initialLocale}>
      <LanguageSwitcher />
    </I18nProvider>,
  );
}

describe("LanguageSwitcher", () => {
  it("renders a button", () => {
    renderSwitcher();
    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
  });

  it("shows '中文' when locale is English", () => {
    renderSwitcher("en");
    expect(screen.getByTestId("language-switcher")).toHaveTextContent("中文");
  });

  it("shows 'EN' when locale is Chinese", () => {
    renderSwitcher("zh");
    expect(screen.getByTestId("language-switcher")).toHaveTextContent("EN");
  });

  it("toggles from English to Chinese on click", () => {
    renderSwitcher("en");
    const btn = screen.getByTestId("language-switcher");
    expect(btn).toHaveTextContent("中文");

    act(() => {
      btn.click();
    });
    expect(btn).toHaveTextContent("EN");
  });

  it("toggles from Chinese to English on click", () => {
    renderSwitcher("zh");
    const btn = screen.getByTestId("language-switcher");
    expect(btn).toHaveTextContent("EN");

    act(() => {
      btn.click();
    });
    expect(btn).toHaveTextContent("中文");
  });

  it("has accessible aria-label for English locale", () => {
    renderSwitcher("en");
    expect(screen.getByTestId("language-switcher")).toHaveAttribute(
      "aria-label",
      "Switch to Chinese",
    );
  });

  it("has accessible aria-label for Chinese locale", () => {
    renderSwitcher("zh");
    expect(screen.getByTestId("language-switcher")).toHaveAttribute(
      "aria-label",
      "Switch to English",
    );
  });

  it("is a button element with type=button", () => {
    renderSwitcher();
    const btn = screen.getByTestId("language-switcher");
    expect(btn.tagName).toBe("BUTTON");
    expect(btn).toHaveAttribute("type", "button");
  });
});
