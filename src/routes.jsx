import App from "./App";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Product, { loader as ProductLoader } from "./pages/Product";
import ErrorPage from "./pages/ErrorPage";
import ErrorElement from "./pages/ErrorElement";

const API_URL = import.meta.env.VITE_API_URL;

// this was to try out const navigation = useNavigation() and navigation.state
// const dummyLoader = () => new Promise((resolve) => setTimeout(resolve, 2000));

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
        loader: async () => {
          try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) {
              throw new Response(response.statusText, {
                status: response.status,
              });
            }
            const products = await response.json();
            let set = new Set();
            for (let product of products) {
              let category = product.category
                .toLowerCase()
                .split(" ")
                .map(function (word) {
                  return word[0].toUpperCase() + word.substr(1);
                })
                .join(" ");
              set.add(category);
            }
            // dummyLoader();
            return [[...set], products];
          } catch (e) {
            if (e instanceof Response || e instanceof Error) throw e;
            throw new Response("Something wrong with the products response", {
              status: 500,
            });
          }
        },
        hydrateFallbackElement: <h2>Loading...</h2>,
        errorElement: <ErrorElement />,
      },
      {
        path: "product/:id",
        element: <Product />,
        loader: ProductLoader,
        hydrateFallbackElement: <h2>Loading...</h2>,
        errorElement: <ErrorElement />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
];

export default routes;
