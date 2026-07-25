import { vi, describe, it, expect, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRouted, renderWithCartItems } from "../test-utils";
import { Route, Outlet } from "react-router";
import NavBar from "../../src/components/NavBar";
import Cart from "../../src/pages/Cart";
import Shop from "../../src/pages/Shop";

describe("Cart", () => {
  afterEach(() => vi.restoreAllMocks());

  it("navigates to Shop from Cart via the Back to Shopping button", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, title: "Widget", price: 9.99, category: "electronics" },
        { id: 2, title: "Gadget", price: 19.99, category: "electronics" },
      ],
    });

    const user = userEvent.setup();
    renderRouted(["/cart"]);

    const shop = screen.getByText(/back to shopping/i);
    expect(shop).toBeInTheDocument();
    await user.click(shop);

    const products = await screen.findAllByRole("img", { hidden: true });
    expect(products.length).toBe(2);
  });

  it("test 2", async () => {
    renderRouted(["/cart"]);

    const cart = screen.getByRole("heading", {
      name: /your cart/i,
      level: 1,
    });
    expect(cart).toBeInTheDocument();

    const search = screen.queryByPlaceholderText(/search your loot/i);
    expect(search).not.toBeInTheDocument();

    const empty = screen.getByText(/your cart is empty/i);
    expect(empty).toBeInTheDocument();

    const pay = screen.queryByText(/pay/i);
    expect(pay).not.toBeInTheDocument();
  });

  it("test 3", async () => {
    const ui = (
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Outlet />
          </>
        }
        errorElement={<h1>Render with cart items error</h1>}
      >
        <Route
          path="cart"
          Component={Cart}
          hydrateFallbackElement={<div>Loading...</div>}
          errorElement={<h1>Render with cart items error cart</h1>}
        />
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
      initialEntries: ["/cart"],
    });

    const cart = screen.getByRole("heading", {
      name: /your cart/i,
      level: 1,
    });
    expect(cart).toBeInTheDocument();

    const search = await screen.findByPlaceholderText(/search your loot/i);
    expect(search).toBeInTheDocument();

    const selectAll = await screen.findByRole("checkbox", {
      name: /select all/i,
    });
    expect(selectAll).toBeInTheDocument();

    const emptyCart = await screen.findByRole("button", {
      name: /empty cart/i,
    });
    expect(emptyCart).toBeInTheDocument();

    const item = await screen.findByText(/widget/i);
    expect(item).toBeInTheDocument();

    const itemCheckbox = await screen.findByRole("checkbox", {
      name: /widget checkbox/i,
    });
    expect(itemCheckbox).toBeInTheDocument();

    const itemTotal = await screen.findByText(/Item Total: 9\.99 gp/i);
    expect(itemTotal).toBeInTheDocument();

    const removeItem = await screen.findByRole("button", {
      name: /remove widget/i,
    });
    expect(removeItem).toBeInTheDocument();

    let counter = await screen.findByLabelText(/quantity count/i);
    expect(counter.textContent).toBe("1");

    let minus = await screen.findByRole("button", {
      name: /decrease widget quantity/i,
    });
    expect(minus).toBeInTheDocument();

    let plus = await screen.findByRole("button", {
      name: /increase widget quantity/i,
    });
    expect(plus).toBeInTheDocument();

    const cartCounter = await screen.findByLabelText(/1 items in cart/i);
    expect(cartCounter.textContent).toBe("1");

    const pay = await screen.findByText(/pay/i);
    expect(pay).toBeInTheDocument();
  });

  it("test 4", async () => {
    const user = userEvent.setup();
    const ui = (
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Outlet />
          </>
        }
        errorElement={<h1>Render with cart items error</h1>}
      >
        <Route
          path="cart"
          Component={Cart}
          hydrateFallbackElement={<div>Loading...</div>}
          errorElement={<h1>Render with cart items error cart</h1>}
        />
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
        {
          id: 2,
          title: "Gadget",
          price: 19.99,
          category: "electronics",
          description: "An electronic gadget.",
          rating: { rate: 3.8, count: 12 },
        },
      ],
      initialEntries: ["/cart"],
    });

    const selectAll = await screen.findByRole("checkbox", {
      name: /select all/i,
    });
    expect(selectAll).toBeInTheDocument();

    const emptyCart = await screen.findByRole("button", {
      name: /empty cart/i,
    });
    expect(emptyCart).toBeInTheDocument();

    const widgetCheckbox = await screen.findByRole("checkbox", {
      name: /widget checkbox/i,
    });
    expect(widgetCheckbox).toBeInTheDocument();

    const removeWidget = await screen.findByRole("button", {
      name: /remove widget/i,
    });
    expect(removeWidget).toBeInTheDocument();
    expect(removeWidget).not.toBeDisabled();

    let widgetTotal = await screen.findByText(/Item Total: 9\.99 gp/i);
    expect(widgetTotal).toBeInTheDocument();

    const gadgetCheckbox = await screen.findByRole("checkbox", {
      name: /gadget checkbox/i,
    });
    expect(gadgetCheckbox).toBeInTheDocument();

    const removeGadget = await screen.findByRole("button", {
      name: /remove gadget/i,
    });
    expect(removeGadget).toBeInTheDocument();
    expect(removeGadget).not.toBeDisabled();

    let gadgetTotal = await screen.findByText(/Item Total: 19\.99 gp/i);
    expect(gadgetTotal).toBeInTheDocument();

    let damage = await screen.findByLabelText(/pay the damage/i);
    expect(damage.textContent).toBe("Pay 0 gp");

    await user.click(selectAll);
    expect(emptyCart).not.toBeDisabled();

    expect(damage.textContent).toBe("Pay 29.98 gp");

    expect(removeWidget).not.toBeDisabled();
    expect(removeGadget).not.toBeDisabled();

    await user.click(widgetCheckbox);

    expect(removeWidget).not.toBeDisabled();
    expect(removeGadget).not.toBeDisabled();

    expect(selectAll).not.toBeChecked();
    expect(damage.textContent).toBe("Pay 19.99 gp");

    await user.click(gadgetCheckbox);
    expect(emptyCart).toBeDisabled();
    expect(removeWidget).not.toBeDisabled();
    expect(removeGadget).not.toBeDisabled();

    expect(damage.textContent).toBe("Pay 0 gp");
    expect(selectAll).not.toBeChecked();

    await user.click(widgetCheckbox);
    expect(emptyCart).not.toBeDisabled();
    expect(damage.textContent).toBe("Pay 9.99 gp");
    expect(removeWidget).not.toBeDisabled();
    expect(removeGadget).not.toBeDisabled();

    await user.click(gadgetCheckbox);
    expect(emptyCart).not.toBeDisabled();
    expect(damage.textContent).toBe("Pay 29.98 gp");
    expect(removeWidget).not.toBeDisabled();
    expect(removeGadget).not.toBeDisabled();

    expect(selectAll).toBeChecked();
  });

  it("test 5", async () => {
    const user = userEvent.setup();
    const ui = (
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Outlet />
          </>
        }
        errorElement={<h1>Render with cart items error</h1>}
      >
        <Route
          path="cart"
          Component={Cart}
          hydrateFallbackElement={<div>Loading...</div>}
          errorElement={<h1>Render with cart items error cart</h1>}
        />
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
        {
          id: 2,
          title: "Gadget",
          price: 19.99,
          category: "electronics",
          description: "An electronic gadget.",
          rating: { rate: 3.8, count: 12 },
        },
      ],
      initialEntries: ["/cart"],
    });

    const selectAll = await screen.findByRole("checkbox", {
      name: /select all/i,
    });
    expect(selectAll).toBeInTheDocument();

    const emptyCart = await screen.findByRole("button", {
      name: /empty cart/i,
    });
    expect(emptyCart).toBeInTheDocument();

    await user.click(selectAll);

    expect(emptyCart).not.toBeDisabled();
    expect(selectAll).toBeChecked();

    await user.click(emptyCart);

    const search = screen.queryByPlaceholderText(/search your loot/i);
    expect(search).not.toBeInTheDocument();

    const empty = screen.getByText(/your cart is empty/i);
    expect(empty).toBeInTheDocument();

    const pay = screen.queryByText(/pay/i);
    expect(pay).not.toBeInTheDocument();
  });

  it("test 6", async () => {
    const user = userEvent.setup();
    const ui = (
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Outlet />
          </>
        }
        errorElement={<h1>Render with cart items error</h1>}
      >
        <Route
          path="cart"
          Component={Cart}
          hydrateFallbackElement={<div>Loading...</div>}
          errorElement={<h1>Render with cart items error cart</h1>}
        />
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
        {
          id: 2,
          title: "Gadget",
          price: 19.99,
          category: "electronics",
          description: "An electronic gadget.",
          rating: { rate: 3.8, count: 12 },
        },
      ],
      initialEntries: ["/cart"],
    });

    const widgetCheckbox = await screen.findByRole("checkbox", {
      name: /widget checkbox/i,
    });
    expect(widgetCheckbox).toBeInTheDocument();

    const removeWidget = await screen.findByRole("button", {
      name: /remove widget/i,
    });
    expect(removeWidget).toBeInTheDocument();
    expect(removeWidget).not.toBeDisabled();

    const gadgetCheckbox = await screen.findByRole("checkbox", {
      name: /gadget checkbox/i,
    });
    expect(gadgetCheckbox).toBeInTheDocument();

    const removeGadget = await screen.findByRole("button", {
      name: /remove gadget/i,
    });

    expect(removeGadget).toBeInTheDocument();
    expect(removeGadget).not.toBeDisabled();

    let damage = await screen.findByLabelText(/pay the damage/i);
    expect(damage.textContent).toBe("Pay 0 gp");

    await user.click(widgetCheckbox);
    await user.click(gadgetCheckbox);

    expect(damage.textContent).toBe("Pay 29.98 gp");

    await user.click(removeWidget);
    let widget = screen.queryByText("Widget");

    expect(widget).not.toBeInTheDocument();
    expect(damage.textContent).toBe("Pay 19.99 gp");

    await user.click(removeGadget);
    damage = screen.queryByLabelText(/pay the damage/i);
    expect(damage).not.toBeInTheDocument();

    const search = screen.queryByPlaceholderText(/search your loot/i);
    expect(search).not.toBeInTheDocument();

    const empty = screen.getByText(/your cart is empty/i);
    expect(empty).toBeInTheDocument();

    const pay = screen.queryByText(/pay/i);
    expect(pay).not.toBeInTheDocument();
  });

  it("test 7", async () => {
    const user = userEvent.setup();
    const ui = (
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Outlet />
          </>
        }
        errorElement={<h1>Render with cart items error</h1>}
      >
        <Route
          path="cart"
          Component={Cart}
          hydrateFallbackElement={<div>Loading...</div>}
          errorElement={<h1>Render with cart items error cart</h1>}
        />
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
        {
          id: 2,
          title: "Gadget",
          price: 19.99,
          category: "electronics",
          description: "An electronic gadget.",
          rating: { rate: 3.8, count: 12 },
        },
      ],
      initialEntries: ["/cart"],
    });

    const widgetCheckbox = await screen.findByRole("checkbox", {
      name: /widget checkbox/i,
    });
    expect(widgetCheckbox).toBeInTheDocument();

    let widgetTotal = await screen.findByText(/Item Total: 9\.99 gp/i);
    expect(widgetTotal).toBeInTheDocument();

    let widgetCount = await screen.findByLabelText(/widget quantity count/i);
    expect(widgetCount.textContent).toBe("1");

    let widgetMinus = await screen.findByRole("button", {
      name: /decrease widget quantity/i,
    });
    expect(widgetMinus).toBeInTheDocument();

    let widgetPlus = await screen.findByRole("button", {
      name: /increase widget quantity/i,
    });
    expect(widgetPlus).toBeInTheDocument();

    await user.click(widgetPlus);
    expect(widgetCount.textContent).toBe("2");
    widgetTotal = await screen.findByText(/Item Total: 19\.98 gp/i);
    expect(widgetTotal).toBeInTheDocument();

    await user.click(widgetPlus);
    expect(widgetCount.textContent).toBe("3");
    widgetTotal = await screen.findByText(/Item Total: 29\.97 gp/i);
    expect(widgetTotal).toBeInTheDocument();

    let damage = await screen.findByLabelText(/pay the damage/i);
    expect(damage.textContent).toBe("Pay 0 gp");

    await user.click(widgetCheckbox);

    expect(damage.textContent).toBe("Pay 29.97 gp");

    await user.click(widgetMinus);

    expect(widgetCount.textContent).toBe("2");
    expect(damage.textContent).toBe("Pay 19.98 gp");
    widgetTotal = await screen.findByText(/Item Total: 19\.98 gp/i);
    expect(widgetTotal).toBeInTheDocument();

    await user.click(widgetCheckbox);
    expect(damage.textContent).toBe("Pay 0 gp");

    const gadgetCheckbox = await screen.findByRole("checkbox", {
      name: /gadget checkbox/i,
    });
    expect(gadgetCheckbox).toBeInTheDocument();

    let gadgetTotal = await screen.findByText(/Item Total: 19\.99 gp/i);
    expect(gadgetTotal).toBeInTheDocument();

    let gadgetCount = await screen.findByLabelText(/gadget quantity count/i);
    expect(gadgetCount.textContent).toBe("1");

    let gadgetMinus = await screen.findByRole("button", {
      name: /decrease gadget quantity/i,
    });
    expect(gadgetMinus).toBeInTheDocument();

    let gadgetPlus = await screen.findByRole("button", {
      name: /increase gadget quantity/i,
    });
    expect(gadgetPlus).toBeInTheDocument();

    await user.click(widgetCheckbox);
    await user.click(gadgetCheckbox);

    expect(damage.textContent).toBe("Pay 39.97 gp");

    await user.click(gadgetCheckbox);
    expect(damage.textContent).toBe("Pay 19.98 gp");
    await user.click(gadgetCheckbox);
    expect(damage.textContent).toBe("Pay 39.97 gp");

    await user.click(widgetCheckbox);
    expect(damage.textContent).toBe("Pay 19.99 gp");
    await user.click(widgetCheckbox);
    expect(damage.textContent).toBe("Pay 39.97 gp");

    await user.click(gadgetPlus);

    gadgetTotal = await screen.findByText(/Item Total: 39\.98 gp/i);
    expect(gadgetTotal).toBeInTheDocument();
    expect(gadgetCount.textContent).toBe("2");
    expect(damage.textContent).toBe("Pay 59.96 gp");

    await user.click(widgetPlus);
    expect(damage.textContent).toBe("Pay 69.95 gp");

    await user.click(gadgetMinus);
    expect(gadgetCount.textContent).toBe("1");
    expect(damage.textContent).toBe("Pay 49.96 gp");

    await user.click(gadgetMinus);
    await user.click(widgetMinus);
    await user.click(widgetMinus);
    await user.click(widgetMinus);

    const search = screen.queryByPlaceholderText(/search your loot/i);
    expect(search).not.toBeInTheDocument();

    const empty = screen.getByText(/your cart is empty/i);
    expect(empty).toBeInTheDocument();

    const pay = screen.queryByText(/pay/i);
    expect(pay).not.toBeInTheDocument();
  });

  it("checkbox persistance", async () => {
    const user = userEvent.setup();
    const ui = (
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Outlet />
          </>
        }
        errorElement={<h1>Render with cart items error</h1>}
      >
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
          path="cart"
          Component={Cart}
          hydrateFallbackElement={<div>Loading...</div>}
          errorElement={<h1>Render with cart items error cart</h1>}
        />
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
      initialEntries: ["/cart"],
    });

    const widgetCheckbox = await screen.findByRole("checkbox", {
      name: /widget checkbox/i,
    });
    expect(widgetCheckbox).toBeInTheDocument();
    await user.click(widgetCheckbox);
    const shop = screen.getByText(/back to shopping/i);
    await user.click(shop);

    const checkout = await screen.findByText(/checkout/i);
    await user.click(checkout);
    expect(widgetCheckbox).toBeChecked();
  });

  it("search", async () => {
    const user = userEvent.setup();
    const ui = (
      <Route
        path="/"
        element={
          <>
            <NavBar />
            <Outlet />
          </>
        }
        errorElement={<h1>Render with cart items error</h1>}
      >
        <Route
          path="cart"
          Component={Cart}
          hydrateFallbackElement={<div>Loading...</div>}
          errorElement={<h1>Render with cart items error cart</h1>}
        />
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
        {
          id: 2,
          title: "Gadget",
          price: 19.99,
          category: "electronics",
          description: "An electronic gadget.",
          rating: { rate: 3.8, count: 12 },
        },
      ],
      initialEntries: ["/cart"],
    });

    const search = await screen.findByPlaceholderText(/search your loot/i);
    expect(search).toBeInTheDocument();

    await user.type(search, "test");

    let widget = screen.queryByText(/widget/i);
    expect(widget).not.toBeInTheDocument();

    let gadget = screen.queryByText(/gadget/i);
    expect(gadget).not.toBeInTheDocument();

    await user.clear(search);

    widget = screen.queryByText(/widget/i);
    expect(widget).toBeInTheDocument();
    gadget = screen.queryByText(/gadget/i);
    expect(gadget).toBeInTheDocument();

    await user.type(search, "gad");

    gadget = await screen.findByText(/gadget/i);
    expect(gadget).toBeInTheDocument();

    widget = screen.queryByText(/widget/i);
    expect(widget).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "wid");

    gadget = screen.queryByText(/gadget/i);
    expect(gadget).not.toBeInTheDocument();

    widget = await screen.findByText(/widget/i);
    expect(widget).toBeInTheDocument();
  });
});
