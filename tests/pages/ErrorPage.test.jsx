import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderRouted } from "../test-utils";

describe("ErrorPage", () => {
  it("renders error heading and navigates to home via link", async () => {
    const user = userEvent.setup();
    renderRouted(["/unknown"]);

    const heading = await screen.findByRole("heading", {
      name: /oh no, this route doesn't exist!/i,
    });
    expect(heading).toBeInTheDocument();

    const link = screen.getByRole("link", {
      name: /go back to the home page/i,
    });
    expect(link).toBeInTheDocument();

    await user.click(link);

    const welcome = await screen.findByText(/welcome/i);
    expect(welcome).toBeInTheDocument();
  });
});
