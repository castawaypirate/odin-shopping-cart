import { describe, it, expect } from "vitest";
import { customRender } from "../../test-utils";
import CartIcon from "../../../src/components/Icons/CartIcon";
import HomeIcon from "../../../src/components/Icons/HomeIcon";
import ShopIcon from "../../../src/components/Icons/ShopIcon";

describe("Icons", () => {
  it("renders CartIcon as SVG", () => {
    const { container } = customRender(<CartIcon size={24} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders HomeIcon as SVG", () => {
    const { container } = customRender(<HomeIcon size={24} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders ShopIcon as SVG", () => {
    const { container } = customRender(<ShopIcon size={24} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
