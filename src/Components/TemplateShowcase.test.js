import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import TemplateShowcase from "./TemplateShowcase";

afterEach(() => {
  document.body.style.overflow = "";
});

test("shows a curated set of real MLink templates and opens a live preview", () => {
  render(<TemplateShowcase />);

  const section = screen.getByRole("region", { name: /a first look at mlink templates/i });
  expect(section).toHaveAttribute("id", "templates");
  expect(within(section).getAllByRole("button", { name: /^Preview .* template$/ })).toHaveLength(4);
  expect(within(section).getByText(/fashion · terracotta portfolio/i)).toBeInTheDocument();
  expect(within(section).getByText(/business · gallery/i)).toBeInTheDocument();
  expect(within(section).getByText(/technology · after hours/i)).toBeInTheDocument();
  expect(within(section).getByText(/creator · signature/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Preview Fashion Terracotta Portfolio template" }));

  const dialog = screen.getByRole("dialog", { name: "Fashion Terracotta Portfolio" });
  expect(within(dialog).getByRole("tab", { name: "home" })).toHaveAttribute("aria-selected", "true");
  expect(document.body).toHaveStyle({ overflow: "hidden" });

  fireEvent.click(within(dialog).getByRole("tab", { name: "about" }));
  expect(within(dialog).getByRole("tab", { name: "about" })).toHaveAttribute("aria-selected", "true");
  expect(within(dialog).getByText("Creating meaningful work and sharing what inspires me.")).toBeInTheDocument();

  fireEvent.keyDown(window, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(document.body).toHaveStyle({ overflow: "" });
});
