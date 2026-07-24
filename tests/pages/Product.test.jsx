import { vi, describe, it, expect, afterEach } from "vitest";
import {
  within,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  renderProduct,
  renderRouted,
  fullTestRoutes,
  customRender,
} from "../test-utils";

describe("Product", () => {
  afterEach(() => vi.restoreAllMocks());

  it("test 1", async () => {
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

    let widgetPrice = await screen.findByText(/9\.99/i);
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

  it("test 2", async () => {
    const user = userEvent.setup();
    renderProduct({
      initialItems: [
        {
          id: 1,
          title: "Widget",
          price: 9.99,
          category: "electronics",
          rating: { rate: 4.5, count: 34 },
        },
      ],
      productData: {
        id: 1,
        title: "Widget",
        price: 9.99,
        category: "electronics",
        rating: { rate: 4.5, count: 34 },
      },
      initialEntries: ["/product/1"],
    });

    const fallback = screen.getByText(/loading/i);
    await waitForElementToBeRemoved(fallback);

    let widgetTitle = await screen.findByText("Widget");
    expect(widgetTitle).toBeInTheDocument();

    let widgetPrice = await screen.findByText(/9\.99/i);
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

  it("test 3", async () => {
    const user = userEvent.setup();
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
    const fallback = screen.getByText(/loading/i);
    await waitForElementToBeRemoved(fallback);

    let widgetTitle = await screen.findByText("Widget");
    expect(widgetTitle).toBeInTheDocument();

    let widgetPrice = await screen.findByText(/9\.99/i);
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
});
