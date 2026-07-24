import { vi, describe, it, expect, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRouted } from "../test-utils";

describe("Home", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders welcome heading and hidden easter egg text", () => {
    renderRouted(["/"]);

    const welcome = screen.getByRole("heading", {
      name: /welcome to my shop!/i,
      level: 1,
    });
    expect(welcome).toBeInTheDocument();

    const hidden = screen.getByText(
      "You went into big trouble looking at the HTML. Well Done! Here's your cookie!",
    );

    expect(hidden).toBeInTheDocument();
  });

  it("navigates to Shop from Home via the Start Shopping button", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, title: "Widget", price: 9.99, category: "electronics" },
        { id: 2, title: "Gadget", price: 19.99, category: "electronics" },
      ],
    });
    const user = userEvent.setup();
    renderRouted(["/"]);

    const shop = screen.getByText(/start shopping/i);
    expect(shop).toBeInTheDocument();
    await user.click(shop);

    const widget = await screen.findByText(/widget/i);
    expect(widget).toBeInTheDocument();
  });
});
