import { vi, describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router";
import ErrorElement from "../../src/pages/ErrorElement";

describe("ErrorElement", () => {
  afterEach(() => vi.restoreAllMocks());

  it("shows error status when loader throws a Response", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const routes = createRoutesFromElements(
      <Route
        path="/"
        element={<div />}
        errorElement={<ErrorElement />}
        loader={() => {
          throw new Response("Not Found", { status: 404 });
        }}
      />,
    );
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const heading = await screen.findByRole("heading", {
      name: /error status: 404/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("shows error message when loader throws an Error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const routes = createRoutesFromElements(
      <Route
        path="/"
        element={<div />}
        errorElement={<ErrorElement />}
        loader={() => {
          throw new Error("Something went wrong");
        }}
      />,
    );
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const heading = await screen.findByRole("heading", {
      name: /something went wrong/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
