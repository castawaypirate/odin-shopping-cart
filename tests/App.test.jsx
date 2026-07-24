import { vi, describe, it, expect, afterEach } from "vitest";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route, MemoryRouter } from "react-router";
import {
  renderWithProviders,
  renderRouted,
  fullTestRoutes,
  customRender,
} from "./test-utils";

import Home from "../src/pages/Home";
import Shop from "../src/pages/Shop";
import Cart from "../src/pages/Cart";
import Product from "../src/pages/Product";
import { CartProvider } from "../src/contexts/CartContext";

import App from "../src/App";

describe("App", () => {
  // this is the same as restoreMocks: true in the vite.confg.js inside test
  // without this all whenever an already mocked function is fired it returns
  // the first mocked values
  afterEach(() => vi.restoreAllMocks());

  it("renders a navigation landmark", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("renders the Home page with an inline JSX route tree and custom loaders", () => {
    customRender(
      <Routes>
        <Route
          path="/"
          Component={App}
          errorElement={<h1>Full Routes Error</h1>}
        >
          <Route path="/" Component={Home} />
          <Route
            path="shop"
            Component={Shop}
            hydrateFallbackElement={<div>Loading...</div>}
            loader={() => [
              ["electronics"],
              [
                {
                  id: 1,
                  title: "Widget",
                  price: 9.99,
                  category: "electronics",
                },
                {
                  id: 2,
                  title: "Gadget",
                  price: 19.99,
                  category: "electronics",
                },
              ],
            ]}
            errorElement={<h1>Full Routes Error Shop</h1>}
          />
          <Route
            path="product/:id"
            HydrateFallback={() => <div>Loading...</div>}
            Component={Product}
            loader={() => ({
              id: 1,
              title: "Widget",
              price: 9.99,
              category: "electronics",
            })}
            errorElement={<h1>Full Routes Error Product</h1>}
          />
          <Route path="cart" Component={Cart} />
        </Route>
      </Routes>,
    );

    const welcome = screen.getByText("Welcome to my shop!");

    expect(welcome).toBeInTheDocument();
  });

  it("renders links to Home, Shop, and Cart", () => {
    // this is the same thing as the render above
    render(<App />, { wrapper: MemoryRouter });

    const links = screen.getAllByRole("link");
    expect(links.length).toBe(3);
  });

  it("shows error page for unknown routes", async () => {
    renderRouted(["/unknown"]);

    const error = await screen.findByRole("heading", {
      name: /oh no, this route doesn't exist!/i,
    });

    expect(error).toBeInTheDocument();
  });

  it("shows Home Page content at /", () => {
    renderRouted();

    const welcome = screen.getByText("Welcome to my shop!");

    expect(welcome).toBeInTheDocument();
  });

  it("shows Home Page content at / (render with providers)", () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/"
          Component={App}
          errorElement={<h1>Full Routes Error</h1>}
        >
          <Route path="/" Component={Home} />
        </Route>
      </Routes>,
      {
        providers: [[MemoryRouter, { initialEntries: ["/"] }], [CartProvider]],
      },
    );

    const heading = screen.getByText("Welcome to my shop!");

    expect(heading).toBeInTheDocument();
  });

  it("navigates to Cart when the Cart link is clicked", async () => {
    const user = userEvent.setup();
    // this renders the whole app using RouterProvider and the actual routes of the application - this way <Outlet /> is rendered too
    renderRouted();

    const cart = screen.getByRole("link", { name: /cart/i });
    await user.click(cart);

    const yourCart = await screen.findByRole("heading", { name: /your cart/i });

    expect(yourCart).toBeInTheDocument();
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

  it("renders Shop products via fullTestRoutes with a custom shop loader", async () => {
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

  it("renders Shop page empty via fullTestRoutes' default loader", async () => {
    fullTestRoutes({
      initialEntries: ["/shop"],
    });

    const search = await screen.findByPlaceholderText(/search wares/i);

    expect(search).toBeInTheDocument();
  });

  it("renders Product page via fullTestRoutes with a custom product loader", async () => {
    fullTestRoutes({
      initialEntries: ["/product/1"],
      loaders: {
        product: () => ({
          id: 1,
          title: "Widget",
          price: 9.99,
          category: "electronics",
          rating: { rate: 4.5, count: 34 },
        }),
      },
    });

    const title = await screen.findByRole("heading", {
      name: /widget/i,
      level: 2,
    });

    expect(title).toBeInTheDocument();
  });

  it("shows error element on Product page when no loader is provided", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fullTestRoutes({
      initialEntries: ["/product/1"],
    });
    const fallback = screen.getByText(/loading/i);
    await waitForElementToBeRemoved(fallback);

    const errorProductHeading = await screen.findByRole("heading", {
      name: /full routes error product/i,
    });

    expect(errorProductHeading).toBeInTheDocument();
  });
});
