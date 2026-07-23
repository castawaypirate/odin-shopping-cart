import { vi, describe, it, expect, afterEach } from "vitest";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRouted, fullTestRoutes, customRender } from "../test-utils";

describe("Home", () => {
  afterEach(() => vi.restoreAllMocks());

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
