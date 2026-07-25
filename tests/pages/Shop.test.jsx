import { vi, describe, it, expect, afterEach } from "vitest";
import {
  screen,
  within,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  fullTestRoutes,
  renderRouted,
  renderWithCartItems,
} from "../test-utils";

import { Outlet, Route } from "react-router";

import Shop from "../../src/pages/Shop";
import Home from "../../src/pages/Home";
import Cart from "../../src/pages/Cart";
import Product from "../../src/pages/Product";
import NavBar from "../../src/components/NavBar";

describe("Shop", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders search, checkboxes, Clear All, and product images", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Widget",
          price: 9.99,
          category: "electronics",
          description: "An electronic widget.",
          rating: { rate: 4.5, count: 34 },
        },
        {
          id: 2,
          title: "Gadget",
          price: 19.99,
          category: "electronics",
          description: "An electronic gadget.",
          rating: { rate: 3.8, count: 12 },
        },
        {
          id: 3,
          title: "Gummy bears",
          price: 3.11,
          category: "food",
          rating: { rate: 5, count: 12 },
        },
      ],
    });
    renderRouted(["/shop"]);

    const search = await screen.findByPlaceholderText(/search wares/i);
    expect(search).toBeInTheDocument();

    const categories = await screen.findAllByRole("checkbox");
    expect(categories.length).toBe(2);

    const clearAll = await screen.findByText("Clear All");
    expect(clearAll).toBeInTheDocument();

    const products = await screen.findAllByRole("img", { hidden: true });
    expect(products.length).toBe(3);
  });

  it("shows quantity controls for pre-seeded cart items", async () => {
    const ui = (
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Outlet />
          </>
        }
        errorElement={<h1>Render with providers error app</h1>}
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
                description: "An electronic widget.",
                rating: { rate: 4.5, count: 34 },
              },
              {
                id: 2,
                title: "Gadget",
                price: 19.99,
                category: "electronics",
                description: "An electronic gadget.",
                rating: { rate: 3.8, count: 12 },
              },
            ],
          ]}
          errorElement={<h1>Render with providers error shop</h1>}
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
            description: "An electronic widget.",
            rating: { rate: 4.5, count: 34 },
          })}
          errorElement={<h1>Render with providers error product</h1>}
        />
        <Route path="cart" Component={Cart} />
      </Route>
    );
    renderWithCartItems(ui, {
      initialItems: [
        {
          id: 1,
          title: "Widget",
          price: 9.99,
          category: "electronics",
          description: "An electronic widget.",
          rating: { rate: 4.5, count: 34 },
        },
      ],
      initialEntries: ["/shop"],
    });

    const products = await screen.findAllByRole("img", { hidden: true });
    expect(products.length).toBe(2);

    const card = await screen.findByLabelText(/widget card/i);
    expect(card).toBeInTheDocument();

    const add = await within(card).findByRole("button", {
      name: /increase quantity/i,
    });
    expect(add).toBeInTheDocument();

    const minus = await within(card).findByRole("button", {
      name: /decrease quantity/i,
    });
    expect(minus).toBeInTheDocument();

    const checkout = await within(card).findByRole("button", {
      name: /checkout/i,
    });
    expect(checkout).toBeInTheDocument();
  });

  it("filters products by search text", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Widget",
          price: 9.99,
          category: "electronics",
          description: "An electronic widget.",
          rating: { rate: 4.5, count: 34 },
        },
        {
          id: 2,
          title: "Gadget",
          price: 19.99,
          category: "electronics",
          description: "An electronic gadget.",
          rating: { rate: 3.8, count: 12 },
        },
        { id: 3, title: "Gummy bears", price: 3.11, category: "food" },
      ],
    });
    renderRouted(["/shop"]);

    const search = await screen.findByPlaceholderText(/search wares/i);
    expect(search).toBeInTheDocument();

    await user.type(search, "test");

    let products = screen.queryAllByRole("img", { hidden: true });
    expect(products).toHaveLength(0);
    await user.clear(search);

    await user.type(search, "gad");

    let product = await screen.findByText(/gadget/i);
    expect(product).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "gum");

    product = await screen.findByText(/gum/i);
    expect(product).toBeInTheDocument();

    await user.clear(search);

    products = await screen.findAllByRole("img", { hidden: true });
    expect(products.length).toBe(3);
  });

  it("filters products by category and clears all filters", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Widget",
          price: 9.99,
          category: "electronics",
          description: "An electronic widget.",
          rating: { rate: 4.5, count: 34 },
        },
        {
          id: 2,
          title: "Gadget",
          price: 19.99,
          category: "electronics",
          description: "An electronic gadget.",
          rating: { rate: 3.8, count: 12 },
        },
        {
          id: 3,
          title: "Gummy bears",
          price: 3.11,
          category: "food",
          description: "Delicious gummy bears.",
          rating: { rate: 4.8, count: 100 },
        },
        {
          id: 4,
          title: "LEGO Sukuna",
          price: 999.99,
          category: "toys",
          description: "A LEGO Sukuna figure.",
          rating: { rate: 5.0, count: 1 },
        },
      ],
    });
    renderRouted(["/shop"]);

    const categories = await screen.findAllByRole("checkbox");
    expect(categories.length).toBe(3);

    const electronics = await screen.findByRole("checkbox", {
      name: /electronics/i,
    });
    expect(electronics).not.toBeChecked();

    await user.click(electronics);
    expect(electronics).toBeChecked();

    let products = await screen.findAllByRole("img", { hidden: true });
    expect(products.length).toBe(2);

    await user.click(electronics);
    expect(electronics).not.toBeChecked();

    products = await screen.findAllByRole("img", { hidden: true });
    expect(products.length).toBe(4);

    const food = await screen.findByRole("checkbox", {
      name: /food/i,
    });

    await user.click(food);

    let product = await screen.findByText(/gum/i);
    expect(product).toBeInTheDocument();

    products = await screen.findAllByRole("img", { hidden: true });
    expect(products.length).toBe(1);

    await user.click(electronics);

    products = await screen.findAllByRole("img", { hidden: true });
    expect(products.length).toBe(3);

    const clearAll = await screen.findByRole("button", { name: /clear all/i });
    expect(clearAll).toBeInTheDocument();

    await user.click(clearAll);

    products = await screen.findAllByRole("img", { hidden: true });
    expect(products.length).toBe(4);
  });

  it("combines search and category filters together", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Widget",
          price: 9.99,
          category: "electronics",
          description: "An electronic widget.",
          rating: { rate: 4.5, count: 34 },
        },
        {
          id: 2,
          title: "Gadget",
          price: 19.99,
          category: "electronics",
          description: "An electronic gadget.",
          rating: { rate: 3.8, count: 12 },
        },
        {
          id: 3,
          title: "Gummy bears",
          price: 3.11,
          category: "food",
          description: "Delicious gummy bears.",
          rating: { rate: 4.8, count: 100 },
        },
        {
          id: 4,
          title: "LEGO Sukuna",
          price: 999.99,
          category: "toys",
          description: "A LEGO Sukuna figure.",
          rating: { rate: 5.0, count: 1 },
        },
      ],
    });

    renderRouted(["/shop"]);

    const fallback = screen.getByText(/loading/i);
    await waitForElementToBeRemoved(fallback);

    const food = screen.getByRole("checkbox", { name: /food/i });
    await user.click(food);

    const search = screen.getByPlaceholderText(/search wares/i);
    await user.type(search, "gad");

    let products = screen.queryAllByRole("img", { hidden: true });
    expect(products).toHaveLength(0);

    await user.click(food);

    expect(await screen.findByText(/gadget/i)).toBeInTheDocument();

    await user.clear(search);

    products = await screen.findAllByRole("img", { hidden: true });
    expect(products).toHaveLength(4);
  });

  it("adds items to cart, adjusts quantity, and navigates to checkout", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Widget",
          price: 9.99,
          category: "electronics",
          description: "An electronic widget.",
          rating: { rate: 4.5, count: 34 },
        },
        {
          id: 2,
          title: "Gadget",
          price: 19.99,
          category: "electronics",
          description: "An electronic gadget.",
          rating: { rate: 3.8, count: 12 },
        },
        {
          id: 3,
          title: "Gummy bears",
          price: 3.11,
          category: "food",
          description: "Delicious gummy bears.",
          rating: { rate: 4.8, count: 100 },
        },
        {
          id: 4,
          title: "LEGO Sukuna",
          price: 999.99,
          category: "toys",
          description: "A LEGO Sukuna figure.",
          rating: { rate: 5.0, count: 1 },
        },
      ],
    });

    renderRouted(["/shop"]);

    const fallback = screen.getByText(/loading/i);
    await waitForElementToBeRemoved(fallback);

    const legoCard = await screen.findByLabelText(/lego sukuna card/i);
    expect(legoCard).toBeInTheDocument();

    let addToCartLego = await within(legoCard).findByRole("button", {
      name: /add to cart/i,
    });

    await user.click(addToCartLego);

    expect(addToCartLego).not.toBeInTheDocument();

    let minus = await within(legoCard).findByRole("button", {
      name: /decrease quantity/i,
    });

    await user.click(minus);

    addToCartLego = await within(legoCard).findByRole("button", {
      name: /add to cart/i,
    });
    expect(addToCartLego).toBeInTheDocument();

    const widgetCard = await screen.findByLabelText(/widget card/i);
    expect(widgetCard).toBeInTheDocument();

    const addToCartWidget = await within(widgetCard).findByRole("button", {
      name: /add to cart/i,
    });
    await user.click(addToCartWidget);

    let count = await within(widgetCard).findByLabelText(/quantity count/i);
    expect(count.textContent).toBe("1");

    const plus = await within(widgetCard).findByRole("button", {
      name: /increase quantity/i,
    });

    await user.click(plus);

    expect(count.textContent).toBe("2");

    minus = await within(widgetCard).findByRole("button", {
      name: /decrease quantity/i,
    });

    await user.click(minus);
    expect(count.textContent).toBe("1");

    const gummyCard = await screen.findByLabelText(/gummy bears card/i);
    expect(gummyCard).toBeInTheDocument();

    const addToCartGummy = await within(gummyCard).findByRole("button", {
      name: /add to cart/i,
    });
    await user.click(addToCartGummy);

    count = await within(gummyCard).findByLabelText(/quantity count/i);
    expect(count.textContent).toBe("1");

    const checkout = await within(widgetCard).findByRole("button", {
      name: /checkout/i,
    });

    await user.click(checkout);

    const widget = await screen.findByText(/widget/i);
    expect(widget).toBeInTheDocument();

    const gummy = await screen.findByText(/gummy bears/i);
    expect(gummy).toBeInTheDocument();
  });

  it("navigates to product page when card is clicked (fullTestRoutes)", async () => {
    const user = userEvent.setup();
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
        product: () => ({
          id: 1,
          title: "Widget",
          price: 9.99,
          category: "electronics",
          rating: { rate: 4.5, count: 34 },
        }),
      },
    });

    const product = await screen.findByLabelText(/view widget/i);
    await user.click(product);

    const widget = await screen.findByText(/widget/i);
    expect(widget).toBeInTheDocument();
  });

  it("navigates to product page when card is clicked (mockResolvedValueOnce)", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, title: "Widget", price: 9.99, category: "electronics" },
          { id: 2, title: "Gadget", price: 19.99, category: "electronics" },
          { id: 3, title: "Gummy bears", price: 3.11, category: "food" },
          { id: 4, title: "LEGO Sukuna", price: 999.99, category: "toys" },
        ],
      })
      .mockResolvedValue({
        ok: true,
        text: async () =>
          JSON.stringify({
            id: 1,
            title: "Widget",
            price: 9.99,
            category: "electronics",
            rating: { rate: 4.5, count: 34 },
          }),
        // json: async () => ({
        //   id: 1,
        //   title: "Widget",
        //   price: 9.99,
        //   category: "electronics",
        //   rating: { rate: 4.5, count: 34 },
        // }),
      });

    renderRouted(["/shop"]);

    const product = await screen.findByLabelText(/view widget/i);
    await user.click(product);

    const widget = await screen.findByText(/widget/i);
    expect(widget).toBeInTheDocument();
  });

  it("navigates to product page when card is clicked (mockImplementation)", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
      if (url.toString().match(/\/products\/\d+$/)) {
        return Promise.resolve({
          ok: true,
          text: async () =>
            JSON.stringify({
              id: 1,
              title: "Widget",
              price: 9.99,
              category: "electronics",
              rating: { rate: 4.5, count: 34 },
            }),
          // json: async () => ({
          //   id: 1,
          //   title: "Widget",
          //   price: 9.99,
          //   category: "electronics",
          //   rating: { rate: 4.5, count: 34 },
          // }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => [
          { id: 1, title: "Widget", price: 9.99, category: "electronics" },
          { id: 2, title: "Gadget", price: 19.99, category: "electronics" },
          { id: 3, title: "Gummy bears", price: 3.11, category: "food" },
          { id: 4, title: "LEGO Sukuna", price: 999.99, category: "toys" },
        ],
      });
    });

    renderRouted(["/shop"]);

    const product = await screen.findByLabelText(/view widget/i);
    await user.click(product);

    const widget = await screen.findByText(/widget/i);
    expect(widget).toBeInTheDocument();
  });

  it("items added in shop are pre-checked in cart", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Widget",
          price: 9.99,
          category: "electronics",
          description: "An electronic widget.",
          rating: { rate: 4.5, count: 34 },
        },
        {
          id: 2,
          title: "Gadget",
          price: 19.99,
          category: "electronics",
          description: "An electronic gadget.",
          rating: { rate: 3.8, count: 12 },
        },
        {
          id: 3,
          title: "Gummy bears",
          price: 3.11,
          category: "food",
          description: "Delicious gummy bears.",
          rating: { rate: 4.8, count: 100 },
        },
        {
          id: 4,
          title: "LEGO Sukuna",
          price: 999.99,
          category: "toys",
          description: "A LEGO Sukuna figure.",
          rating: { rate: 5.0, count: 1 },
        },
      ],
    });
    renderRouted(["/shop"]);

    const widgetCard = await screen.findByLabelText(/widget card/i);
    expect(widgetCard).toBeInTheDocument();

    const addToCartWidget = await within(widgetCard).findByRole("button", {
      name: /add to cart/i,
    });
    await user.click(addToCartWidget);

    const legoCard = await screen.findByLabelText(/lego sukuna card/i);
    expect(legoCard).toBeInTheDocument();

    let addToCartLego = await within(legoCard).findByRole("button", {
      name: /add to cart/i,
    });

    await user.click(addToCartLego);

    let cart = await screen.findByRole("link", {
      name: /cart/i,
    });

    await user.click(cart);

    const selectAll = await screen.findByLabelText(/select all/i);
    expect(selectAll).toBeChecked();

    const widgetCheckbox = await screen.findByLabelText(/widget checkbox/i);
    expect(widgetCheckbox).toBeChecked();

    const legoCheckbox = await screen.findByLabelText(/lego sukuna checkbox/i);
    expect(legoCheckbox).toBeChecked();

    const damage = await screen.findByLabelText(/pay the damage/i);
    expect(damage.textContent).toBe("Pay 1009.98 gp");
  });
});
