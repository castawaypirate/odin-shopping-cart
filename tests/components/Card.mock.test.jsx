import { vi, describe, it, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithProviders, customRender } from "../test-utils.jsx";

import Card from "../../src/components/Card.jsx";

const mockedUseNavigate = vi.fn();
vi.mock("react-router", async () => {
  const mod = await vi.importActual("react-router");
  return {
    ...mod,
    useNavigate: () => mockedUseNavigate,
  };
});

describe("Card (mock)", () => {
  afterEach(() => vi.restoreAllMocks());
  it("calls useNavigate with /cart when checkout is clicked", async () => {
    const user = userEvent.setup();
    const props = {
      click: () => {},
      handleAdd: () => {},
      handleRemove: () => {},
      product: { id: 1, title: "Gadget", price: "19.99" },
      count: 1,
    };
    renderWithProviders(<Card {...props} />);

    const checkout = await screen.findByRole("button", {
      name: /checkout/i,
    });

    await user.click(checkout);
    expect(mockedUseNavigate).toHaveBeenCalledWith("/cart");
  });

  it("calls click handler with product id when product card is clicked", async () => {
    const mockedClick = vi.fn();
    const user = userEvent.setup();
    const props = {
      click: mockedClick,
      handleAdd: () => {},
      handleRemove: () => {},
      product: { id: 1, title: "Gadget", price: "19.99" },
      count: 1,
    };
    renderWithProviders(<Card {...props} />);

    const product = screen.getByLabelText(/view gadget/i);
    await user.click(product);
    expect(mockedClick).toHaveBeenCalledWith(1);
  });

  it("calls handleAdd with product when add to cart is clicked", async () => {
    const mockedHandleAdd = vi.fn();
    const user = userEvent.setup();
    const props = {
      click: () => {},
      handleAdd: mockedHandleAdd,
      handleRemove: () => {},
      product: { id: 1, title: "Gadget", price: "19.99" },
      count: 0,
    };
    customRender(<Card {...props} />);

    const addToCart = screen.getByLabelText(/add to cart/i);
    await user.click(addToCart);
    expect(mockedHandleAdd).toHaveBeenCalledWith({
      id: 1,
      title: "Gadget",
      price: "19.99",
    });
  });

  it("calls handleAdd with product when increase quantity is clicked", async () => {
    const mockedHandleAdd = vi.fn();

    const user = userEvent.setup();
    const props = {
      click: () => {},
      handleAdd: mockedHandleAdd,
      handleRemove: () => {},
      product: { id: 1, title: "Gadget", price: "19.99" },
      count: 1,
    };
    customRender(<Card {...props} />);

    const add = screen.getByLabelText(/increase quantity/i);
    await user.click(add);

    expect(mockedHandleAdd).toHaveBeenCalledWith({
      id: 1,
      title: "Gadget",
      price: "19.99",
    });
  });

  it("calls handleRemove with product when decrease quantity is clicked", async () => {
    const mockedHandleRemove = vi.fn();

    const user = userEvent.setup();
    const props = {
      click: () => {},
      handleAdd: () => {},
      handleRemove: mockedHandleRemove,
      product: { id: 1, title: "Gadget", price: "19.99" },
      count: 1,
    };
    customRender(<Card {...props} />);

    const minus = screen.getByLabelText(/decrease quantity/i);
    await user.click(minus);

    expect(mockedHandleRemove).toHaveBeenCalledWith({
      id: 1,
      title: "Gadget",
      price: "19.99",
    });
  });
});
