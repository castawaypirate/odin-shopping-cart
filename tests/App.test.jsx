import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import App from "../src/App";

describe("App", () => {
  it("renders navigation landmard", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    screen.debug();

    const nav = screen.getByRole("navigation");

    expect(nav).toBeInTheDocument();
  });

  it("renders links to Home, Shop, and Cart", () => {
    // this is the same thing as the render above
    render(<App />, { wrapper: MemoryRouter });

    const links = screen.getAllByRole("link");
    expect(links.length).toBe(3);
  });
});
