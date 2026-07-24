import { vi, describe, it, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, fireEvent } from "@testing-library/react";
import { customRender } from "../test-utils.jsx";
import { useLocation } from "react-router";

import Card from "../../src/components/Card";

function LocationDisplay() {
  const location = useLocation();

  return <div data-testid="location-display">{location.pathname}</div>;
}

describe("Card", () => {
  it("renders product title, count, and +/- buttons", async () => {
    const props = {
      click: () => {},
      handleAdd: () => {},
      handleRemove: () => {},
      product: { id: 1, title: "Gadget", price: "19.99" },
      count: 4,
    };
    customRender(<Card {...props} />);

    const title = screen.getByText("Gadget");
    expect(title).toBeInTheDocument();

    const count = screen.getByText("4");
    expect(count).toBeInTheDocument();

    const add = await screen.findByRole("button", {
      name: /increase quantity/i,
    });

    expect(add).toBeInTheDocument();
    const minus = await screen.findByRole("button", {
      name: /decrease quantity/i,
    });

    expect(minus).toBeInTheDocument();
  });

  it("shows add to cart button when count is zero", async () => {
    const props = {
      click: () => {},
      handleAdd: () => {},
      handleRemove: () => {},
      product: { id: 1, title: "Gadget", price: "19.99" },
      count: 0,
    };
    customRender(<Card {...props} />);

    const addToCart = await screen.findByRole("button", {
      name: /add to cart/i,
    });

    expect(addToCart).toBeInTheDocument();
  });

  it("navigates to /cart when checkout is clicked", async () => {
    const user = userEvent.setup();
    const props = {
      click: () => {},
      handleAdd: () => {},
      handleRemove: () => {},
      product: { id: 1, title: "Gadget", price: "19.99" },
      count: 1,
    };
    customRender(
      <>
        <Card {...props} />
        <LocationDisplay />
      </>,
    );

    const checkout = await screen.findByRole("button", {
      name: /checkout/i,
    });

    expect(checkout).toBeInTheDocument();
    await user.click(checkout);

    const locationDisplay = screen.getByTestId("location-display");
    expect(locationDisplay.textContent).toBe("/cart");
  });

  it("shows loading text while image loads, then removes it", () => {
    const props = {
      click: () => {},
      handleAdd: () => {},
      handleRemove: () => {},
      product: { id: 1, title: "Gadget", price: "19.99" },
      count: 1,
    };
    customRender(<Card {...props} />);

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
  });
});
