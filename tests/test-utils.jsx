import { render } from "@testing-library/react";
import {
  Route,
  Routes,
  MemoryRouter,
  RouterProvider,
  createMemoryRouter,
  createRoutesFromElements,
  createBrowserRouter,
} from "react-router";
import { CartProvider } from "../src/contexts/CartContext";
import routes from "../src/routes";
import Home from "../src/pages/Home";
import Cart from "../src/pages/Cart";
import Shop from "../src/pages/Shop";
import Product from "../src/pages/Product";
import App from "../src/App";

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

export { customRender };

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

const renderRouted = (initialEntries = ["/"]) => {
  const router = createMemoryRouter(routes, { initialEntries });
  return render(<RouterProvider router={router} />);
};

export { renderRouted };

const fullTestRoutes = ({ initialEntries = ["/"], loaders = {} } = {}) => {
  const fullRoutes = createRoutesFromElements(
    <>
      <Route path="/" Component={App} errorElement={<h1>Full Routes Error</h1>}>
        <Route path="/" Component={Home} />
        <Route
          path="shop"
          Component={Shop}
          hydrateFallbackElement={<div>Loading...</div>}
          loader={loaders.shop ? loaders.shop : () => [[], []]}
          errorElement={<h1>Full Routes Error Shop</h1>}
        />
        <Route
          path="product/:id"
          HydrateFallback={() => <div>Loading...</div>}
          Component={Product}
          loader={loaders.product ? loaders.product : () => {}}
          errorElement={<h1>Full Routes Error Product</h1>}
        />
        <Route path="cart" Component={Cart} />
      </Route>
    </>,
  );

  const router = createMemoryRouter(fullRoutes, { initialEntries });
  return render(<RouterProvider router={router} />);
};

export { fullTestRoutes };
