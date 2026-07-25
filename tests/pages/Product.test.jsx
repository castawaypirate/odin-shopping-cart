import { vi, describe, it, expect, afterEach } from "vitest";
import {
  within,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderProduct, renderRouted, fullTestRoutes } from "../test-utils";

describe("Product", () => {
  afterEach(() => vi.restoreAllMocks());

  it("adds item from empty cart, adjusts quantity, and navigates to checkout via renderRouted", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          id: 1,
          title: "Widget",
          price: 9.99,
          category: "electronics",
          description: "An electronic widget.",
          rating: { rate: 4.5, count: 34 },
        }),
    });

    const user = userEvent.setup();
    renderRouted(["/product/1"]);

    const fallback = screen.getByText(/loading/i);
    await waitForElementToBeRemoved(fallback);

    let widgetTitle = await screen.findByText("Widget");
    expect(widgetTitle).toBeInTheDocument();

    let widgetPrice = await screen.findByText(/9\.99 gp/i);
    expect(widgetPrice).toBeInTheDocument();

    let widgetCategory = await screen.findByText(/electronics/i);
    expect(widgetCategory).toBeInTheDocument();

    let widgetDescription = await screen.findByText(/an electronic widget/i);
    expect(widgetDescription).toBeInTheDocument();

    const ratingValue = await screen.findByText(/4\.5\/5/);
    expect(ratingValue).toBeInTheDocument();

    const ratingCount = await screen.findByText(/34/);
    expect(ratingCount).toBeInTheDocument();

    // first add to cart
    let addToCart = await screen.findByRole("button", {
      name: /add to cart/i,
    });
    await user.click(addToCart);

    let counter = await screen.findByLabelText(/quantity count/i);
    expect(counter).toBeInTheDocument();

    // remove it
    let minus = await screen.findByRole("button", {
      name: /decrease quantity/i,
    });
    await user.click(minus);

    //add it again
    addToCart = await screen.findByRole("button", {
      name: /add to cart/i,
    });
    expect(addToCart).toBeInTheDocument();
    await user.click(addToCart);

    // and again
    let plus = await screen.findByRole("button", {
      name: /increase quantity/i,
    });
    await user.click(plus);

    counter = await screen.findByLabelText(/quantity count/i);
    expect(counter.textContent).toBe("2");

    // check navbar cart count
    const cartCounter = await screen.findByLabelText(/2 items in cart/i);
    expect(cartCounter.textContent).toBe("2");

    // go to cart page
    const checkout = await screen.findByRole("button", {
      name: /checkout/i,
    });

    await user.click(checkout);

    // find listing of item and check count
    const widgetListing = await screen.findByLabelText(/widget listing/i);
    expect(widgetListing).toBeInTheDocument();

    const cartWidgetCount = await within(widgetListing).findByLabelText(
      /widget quantity count/i,
    );
    expect(cartWidgetCount.textContent).toBe("2");
  });

  it("starts with pre-seeded cart, adjusts quantity, and navigates to checkout via renderProduct", async () => {
    const user = userEvent.setup();
    renderProduct({
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
      productData: {
        id: 1,
        title: "Widget",
        price: 9.99,
        category: "electronics",
        description: "An electronic widget.",
        rating: { rate: 4.5, count: 34 },
      },
      initialEntries: ["/product/1"],
    });

    const fallback = screen.getByText(/loading/i);
    await waitForElementToBeRemoved(fallback);

    let widgetTitle = await screen.findByText("Widget");
    expect(widgetTitle).toBeInTheDocument();

    let widgetPrice = await screen.findByText(/9\.99 gp/i);
    expect(widgetPrice).toBeInTheDocument();

    let widgetCategory = await screen.findByText(/electronics/i);
    expect(widgetCategory).toBeInTheDocument();

    let widgetDescription = await screen.findByText(/an electronic widget/i);
    expect(widgetDescription).toBeInTheDocument();

    const ratingValue = await screen.findByText(/4\.5\/5/);
    expect(ratingValue).toBeInTheDocument();

    const ratingCount = await screen.findByText(/34/);
    expect(ratingCount).toBeInTheDocument();

    // item already in cart so check counter
    let counter = await screen.findByLabelText(/quantity count/i);
    expect(counter).toBeInTheDocument();

    // remove it
    let minus = await screen.findByRole("button", {
      name: /decrease quantity/i,
    });
    await user.click(minus);

    //add it again
    let addToCart = await screen.findByRole("button", {
      name: /add to cart/i,
    });
    expect(addToCart).toBeInTheDocument();
    await user.click(addToCart);

    // and again
    let plus = await screen.findByRole("button", {
      name: /increase quantity/i,
    });
    await user.click(plus);

    counter = await screen.findByLabelText(/quantity count/i);
    expect(counter.textContent).toBe("2");

    // check navbar cart count
    const cartCounter = await screen.findByLabelText(/2 items in cart/i);
    expect(cartCounter.textContent).toBe("2");

    // go to cart page
    const checkout = await screen.findByRole("button", {
      name: /checkout/i,
    });

    await user.click(checkout);

    // find listing of item and check count
    const widgetListing = await screen.findByLabelText(/widget listing/i);
    expect(widgetListing).toBeInTheDocument();

    const cartWidgetCount = await within(widgetListing).findByLabelText(
      /widget quantity count/i,
    );
    expect(cartWidgetCount.textContent).toBe("2");
  });

  it("adds item from empty cart, adjusts quantity, and navigates to checkout via fullTestRoutes", async () => {
    const user = userEvent.setup();
    fullTestRoutes({
      initialEntries: ["/product/1"],
      loaders: {
        product: () => ({
          id: 1,
          title: "Widget",
          price: 9.99,
          category: "electronics",
          description: "An electronic widget.",
          rating: { rate: 4.5, count: 34 },
        }),
      },
    });
    const fallback = screen.getByText(/loading/i);
    await waitForElementToBeRemoved(fallback);

    let widgetTitle = await screen.findByText("Widget");
    expect(widgetTitle).toBeInTheDocument();

    let widgetPrice = await screen.findByText(/9\.99 gp/i);
    expect(widgetPrice).toBeInTheDocument();

    let widgetCategory = await screen.findByText(/electronics/i);
    expect(widgetCategory).toBeInTheDocument();

    let widgetDescription = await screen.findByText(/an electronic widget/i);
    expect(widgetDescription).toBeInTheDocument();

    const ratingValue = await screen.findByText(/4\.5\/5/);
    expect(ratingValue).toBeInTheDocument();

    const ratingCount = await screen.findByText(/34/);
    expect(ratingCount).toBeInTheDocument();

    // first add to cart
    let addToCart = await screen.findByRole("button", {
      name: /add to cart/i,
    });
    await user.click(addToCart);

    let counter = await screen.findByLabelText(/quantity count/i);
    expect(counter).toBeInTheDocument();

    // remove it
    let minus = await screen.findByRole("button", {
      name: /decrease quantity/i,
    });
    await user.click(minus);

    //add it again
    addToCart = await screen.findByRole("button", {
      name: /add to cart/i,
    });
    expect(addToCart).toBeInTheDocument();
    await user.click(addToCart);

    // and again
    let plus = await screen.findByRole("button", {
      name: /increase quantity/i,
    });
    await user.click(plus);

    counter = await screen.findByLabelText(/quantity count/i);
    expect(counter.textContent).toBe("2");

    // check navbar cart count
    const cartCounter = await screen.findByLabelText(/2 items in cart/i);
    expect(cartCounter.textContent).toBe("2");

    // go to cart page
    const checkout = await screen.findByRole("button", {
      name: /checkout/i,
    });

    await user.click(checkout);

    // find listing of item and check count
    const widgetListing = await screen.findByLabelText(/widget listing/i);
    expect(widgetListing).toBeInTheDocument();

    const cartWidgetCount = await within(widgetListing).findByLabelText(
      /widget quantity count/i,
    );
    expect(cartWidgetCount.textContent).toBe("2");
  });

  it("shows loading state while image loads, then hides it", async () => {
    fullTestRoutes({
      initialEntries: ["/product/1"],
      loaders: {
        product: () => ({
          id: 1,
          image: "widget.png",
          title: "Widget",
          price: 9.99,
          category: "electronics",
          description: "An electronic widget.",
          rating: { rate: 4.5, count: 34 },
        }),
      },
    });

    const fallback = screen.getByText(/loading/i);
    await waitForElementToBeRemoved(fallback);

    let loading = screen.queryByRole("heading", {
      name: /loading/i,
      level: 4,
    });

    expect(loading).toBeInTheDocument();

    fireEvent.load(screen.getByRole("img", { hidden: true }));

    loading = screen.queryByRole("heading", {
      name: /loading/i,
      level: 4,
    });
    expect(loading).not.toBeInTheDocument();

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "widget.png");
    expect(image).toHaveAttribute("alt", "Widget");
  });

  it("shows error page when fetch fails with network error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));

    renderRouted(["/product/1"]);

    const error = await screen.findByRole("heading", {
      name: /network error/i,
    });

    expect(error).toBeInTheDocument();
  });

  it("shows route error boundary when loader returns invalid data", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fullTestRoutes({
      initialEntries: ["/product/1"],
      loaders: {
        product: () => new Error("Network error"),
      },
    });

    const error = await screen.findByRole("heading", {
      name: /full routes error product/i,
    });

    expect(error).toBeInTheDocument();
  });
});
