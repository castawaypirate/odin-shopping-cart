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

// manually provide a router and the actual provider from the app and pass them to render function
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

export { customRender };

// this won't work with loaders because MemoryRouter doesn't know how to handle them and that is why we need RouterProvider
const createProviderWrapper = (initialEntries) => {
  return ({ children }) => (
    <MemoryRouter initialEntries={initialEntries}>
      <CartProvider>{children}</CartProvider>
    </MemoryRouter>
  );
};

const customRenderInitial = (ui, options) => {
  const { initialEntries = ["/"], ...rtlOptions } = options || {};

  return render(ui, {
    wrapper: createProviderWrapper(initialEntries),
    ...rtlOptions,
  });
};

export { customRenderInitial };

// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";

// dynamically provide the providers that will wrap up the content starting from the inner peel of the app onion to the outer, children are the components that should be nested, in the first iteration of reduceRight they are placed in the core of the onion, so content in the first iteration takes the value of the variable after "," which is children, in the second iteration what was built in the first iteration is returned and takes the place of content, so in the second iteration in the content value we have children wrapped up by one provider, in the second we have children wrapped up by two providers and so on, destructuring props inside a jsx element means that it should have key and value so the result be something like <Provider key={value}>content</Provider>
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
