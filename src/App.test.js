import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

jest.mock("./Api/Subscriptionapi", () => ({
  getMySubscription: jest.fn().mockResolvedValue(null),
}));

function renderApp(initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>
  );
}

test("renders the homepage at the root route", () => {
  renderApp();
  expect(
    screen.getByRole("heading", { name: /one link for everything you create/i })
  ).toBeInTheDocument();
});

test("opens pricing directly and navigates back to the homepage", () => {
  renderApp("/pricing");
  expect(
    screen.getByRole("heading", { name: /choose your plan/i })
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /back/i }));

  expect(
    screen.getByRole("heading", { name: /one link for everything you create/i })
  ).toBeInTheDocument();
});
