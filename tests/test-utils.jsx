import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CartProvider } from "../src/contexts/CartContext";

// eslint-disable-next-line react-refresh/only-export-components
const AllTheProviders = ({ children }) => {
  return (
    <MemoryRouter>
      <CartProvider>{children}</CartProvider>
    </MemoryRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";

export { customRender as render };

const nestedProviders = (children, providers) =>
  providers.reduceRight(
    (content, [Provider, props]) => (
      <Provider {...(props || {})}>{content}</Provider>
    ),
    children,
  );

const renderWithProviders = (ui, { providers = [], ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => nestedProviders(children, providers);

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export { renderWithProviders };
