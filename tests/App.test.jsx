import { vi, describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { renderRouted, fullTestRoutes } from "./test-utils";

import App from "../src/App";

describe("App", () => {
  // this is the same as restoreMocks: true in the vite.confg.js inside test
  afterEach(() => vi.restoreAllMocks());

  it("renders navigation landmard", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("renders links to Home, Shop, and Cart", () => {
    // this is the same thing as the render above
    render(<App />, { wrapper: MemoryRouter });

    const links = screen.getAllByRole("link");
    expect(links.length).toBe(3);
  });

  it("need to find title", async () => {
    renderRouted(["/unknown"]);

    const error = await screen.findByRole("heading", {
      name: /oh no, this route doesn't exist!/i,
    });

    expect(error).toBeInTheDocument();
  });

  it("shows Home Page content at /", () => {
    renderRouted();

    const heading = screen.getByText("Welcome to my shop!");

    expect(heading).toBeInTheDocument();
  });

  it("shows the Cart heading when the Cart link is clicked", async () => {
    const user = userEvent.setup();
    // this renders the whole app using RouterProvider and the actual routes of the application - this way <Outlet /> is rendered too
    renderRouted();

    const cart = screen.getByRole("link", { name: /cart/i });
    await user.click(cart);

    const heading = await screen.findByRole("heading", { name: /your cart/i });

    expect(heading).toBeInTheDocument();
  });

  it("displays the empty cart message on the Cart page", async () => {
    const user = userEvent.setup();
    renderRouted();

    const cart = screen.getByRole("link", { name: /cart/i });
    await user.click(cart);

    const text = await screen.findByText(/your cart is empty.../i);

    expect(text).toBeInTheDocument();
  });

  it("shows products on the Shop page after clicking the Shop link", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, title: "Widget", price: 9.99, category: "electronics" },
        { id: 2, title: "Gadget", price: 19.99, category: "electronics" },
      ],
    });

    const user = userEvent.setup();
    renderRouted();

    const shop = screen.getByRole("link", { name: /shop/i });
    await user.click(shop);

    const widget = await screen.findByText(/widget/i);

    expect(widget).toBeInTheDocument();
  });

  it("shows products on the Shop page when navigated directly to /shop", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, title: "Widget", price: 9.99, category: "electronics" },
        { id: 2, title: "Gadget", price: 19.99, category: "electronics" },
      ],
    });

    renderRouted(["/shop"]);

    const gadget = await screen.findByText(/gadget/i);

    expect(gadget).toBeInTheDocument();
  });

  it("shows loading state while Shop data is being fetched", async () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise(() => {}));

    renderRouted(["/shop"]);

    const loading = await screen.findByRole("heading", {
      name: /loading\.\.\./i,
    });

    expect(loading).toBeInTheDocument();
  });

  it("shows error page when Shop data fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));

    renderRouted(["/shop"]);

    const error = await screen.findByRole("heading", {
      name: /network error/i,
    });

    expect(error).toBeInTheDocument();
  });

  it("i test things here", async () => {
    fullTestRoutes({
      initialEntries: ["/shop"],
      loaders: {
        shop: () => [
          ["electronics"],
          [
            { id: 1, title: "Widget", price: 9.99, category: "electronics" },
            { id: 2, title: "Gadget", price: 19.99, category: "electronics" },
          ],
        ],
      },
    });

    const product = await screen.findByText("Widget");

    expect(product).toBeInTheDocument();
  });

  it("i also test things here", async () => {
    fullTestRoutes({
      initialEntries: ["/shop"],
    });

    const search = await screen.findByPlaceholderText(/search wares/i);

    expect(search).toBeInTheDocument();
  });

  it("i also also test things here", async () => {
    fullTestRoutes({
      initialEntries: ["/product/1"],
      loaders: {
        product: () => ({
          id: 1,
          title: "Widget",
          price: 9.99,
          category: "electronics",
        }),
      },
    });
  });

  it("i also also also test things here", async () => {
    fullTestRoutes({
      initialEntries: ["/product/1"],
    });
  });
});
