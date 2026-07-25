import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useContext } from "react";
import { CartProvider, CartContext } from "../../src/contexts/CartContext";

function useTestContext() {
  const [cartItems, addItemToCart, removeItemFromCart, checked, setChecked, emptyCart] =
    useContext(CartContext);
  return { cartItems, addItemToCart, removeItemFromCart, checked, setChecked, emptyCart };
}

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe("CartContext", () => {
  it("starts with empty cart and empty checked set", () => {
    const { result } = renderHook(useTestContext, { wrapper });
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.checked.size).toBe(0);
  });

  it("initializes cart with initialItems but checked stays empty", () => {
    const items = [{ id: 1, title: "Widget", price: 9.99 }];
    const wrapperWithItems = ({ children }) => (
      <CartProvider initialItems={items}>{children}</CartProvider>
    );
    const { result } = renderHook(useTestContext, { wrapper: wrapperWithItems });
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].title).toBe("Widget");
    expect(result.current.checked.size).toBe(0);
  });

  it("addItemToCart adds item and checks it when new", () => {
    const { result } = renderHook(useTestContext, { wrapper });
    const widget = { id: 1, title: "Widget", price: 9.99 };

    act(() => {
      result.current.addItemToCart(widget);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.checked.has(1)).toBe(true);
  });

  it("addItemToCart does not change checked for already-existing items", () => {
    const items = [{ id: 1, title: "Widget", price: 9.99 }];
    const wrapperWithItems = ({ children }) => (
      <CartProvider initialItems={items}>{children}</CartProvider>
    );
    const { result } = renderHook(useTestContext, { wrapper: wrapperWithItems });

    expect(result.current.checked.size).toBe(0);

    act(() => {
      result.current.addItemToCart({ id: 1, title: "Widget", price: 9.99 });
    });

    expect(result.current.cartItems).toHaveLength(2);
    expect(result.current.checked.size).toBe(0);
  });

  it("removeItemFromCart removes one instance", () => {
    const { result } = renderHook(useTestContext, { wrapper });
    const widget = { id: 1, title: "Widget", price: 9.99 };

    act(() => {
      result.current.addItemToCart(widget);
    });
    expect(result.current.cartItems).toHaveLength(1);

    act(() => {
      result.current.removeItemFromCart(widget);
    });
    expect(result.current.cartItems).toHaveLength(0);
  });

  it("removeItemFromCart with count removes multiple instances", () => {
    const { result } = renderHook(useTestContext, { wrapper });
    const widget = { id: 1, title: "Widget", price: 9.99 };

    act(() => {
      result.current.addItemToCart(widget);
    });
    act(() => {
      result.current.addItemToCart(widget);
    });
    act(() => {
      result.current.addItemToCart(widget);
    });
    expect(result.current.cartItems).toHaveLength(3);

    act(() => {
      result.current.removeItemFromCart(widget, 2);
    });
    expect(result.current.cartItems).toHaveLength(1);
  });

  it("emptyCart clears items and checked", () => {
    const { result } = renderHook(useTestContext, { wrapper });
    const widget = { id: 1, title: "Widget", price: 9.99 };

    act(() => {
      result.current.addItemToCart(widget);
    });
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.checked.has(1)).toBe(true);

    act(() => {
      result.current.emptyCart();
    });
    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.checked.size).toBe(0);
  });
});
