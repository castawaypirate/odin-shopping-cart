import { vi, describe, it, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/react";
import {
  customRender,
  renderWithProviders,
  renderRouted,
} from "../test-utils.jsx";
import { MemoryRouter } from "react-router";
import { CartProvider } from "../../src/contexts/CartContext";

import NavBar from "../../src/components/NavBar";

describe("NavBar", () => {
  afterEach(() => vi.restoreAllMocks());
  it("renders as a navigation landmark", () => {
    // custom render imported from test-utils that wraps component with providers
    customRender(<NavBar />);

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("renders with providers passed explicitly via renderWithProviders", () => {
    // this is the same thing the render above, but you can pass as many providers as you want dynamically
    renderWithProviders(<NavBar />, {
      providers: [[MemoryRouter], [CartProvider]],
    });

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("renders links to Home, Shop, and Cart", () => {
    renderWithProviders(<NavBar />, {
      providers: [[MemoryRouter], [CartProvider]],
    });

    const home = screen.getByRole("link", { name: /home/i });
    expect(home).toBeInTheDocument();
    expect(home).toHaveAttribute("href", "/");

    const shop = screen.getByRole("link", { name: /shop/i });
    expect(shop).toBeInTheDocument();
    expect(shop).toHaveAttribute("href", "/shop");

    const cart = screen.getByRole("link", { name: /cart/i });
    expect(cart).toBeInTheDocument();
    expect(cart).toHaveAttribute("href", "/cart");
  });

  it("navigates to Shop from Home via the nav link and displays products", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, title: "Widget", price: 9.99, category: "electronics" },
        { id: 2, title: "Gadget", price: 19.99, category: "electronics" },
      ],
    });
    const user = userEvent.setup();
    renderRouted(["/"]);

    const home = screen.getByRole("heading", { name: /welcome to my shop/i });
    expect(home).toBeInTheDocument();

    const shop = screen.getByRole("link", { name: /shop/i });
    expect(shop).toBeInTheDocument();
    await user.click(shop);

    const gadget = await screen.findByText(/gadget/i);

    expect(gadget).toBeInTheDocument();
  });

  it("navigates to Cart from Home via the nav link", async () => {
    const user = userEvent.setup();
    renderRouted(["/"]);

    const cart = screen.getByRole("link", { name: /cart/i });
    expect(cart).toBeInTheDocument();
    await user.click(cart);

    const yourCart = screen.getByRole("heading", { name: /your cart/i });
    expect(yourCart).toBeInTheDocument();
  });

  it("navigates back to Home from Cart via the nav link", async () => {
    const user = userEvent.setup();
    renderRouted(["/cart"]);

    const home = screen.getByRole("link", { name: /home/i });
    expect(home).toBeInTheDocument();
    await user.click(home);

    const welcome = screen.getByRole("heading", {
      name: /welcome to my shop/i,
    });
    expect(welcome).toBeInTheDocument();
  });

  it("adds items to the cart and updates the badge counter from the Shop page", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, title: "Widget", price: 9.99, category: "electronics" },
        { id: 2, title: "Gadget", price: 19.99, category: "electronics" },
      ],
    });
    const user = userEvent.setup();
    renderRouted(["/shop"]);

    const cart = screen.getByRole("link", { name: /cart/i });
    let cartCounter = within(cart).queryByLabelText(/ items in cart/i);
    expect(cartCounter).not.toBeInTheDocument();

    const addToCart = await screen.findAllByRole("button", {
      name: /add to cart/i,
    });
    await user.click(addToCart[0]);

    cartCounter = await screen.findByLabelText(/1 items in cart/i);
    expect(cartCounter).toBeInTheDocument();

    const add = await screen.findByRole("button", {
      name: /increase quantity/i,
    });
    await user.click(add);
    await user.click(add);

    cartCounter = await screen.findByLabelText(/3 items in cart/i);
    expect(cartCounter).toBeInTheDocument();

    const minus = await screen.findByRole("button", {
      name: /decrease quantity/i,
    });
    await user.click(minus);

    cartCounter = await screen.findByLabelText(/2 items in cart/i);
    expect(cartCounter).toBeInTheDocument();
  });
});
