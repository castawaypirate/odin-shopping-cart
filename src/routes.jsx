import App from "./App";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Product, { loader as ProductLoader } from "./pages/Product";
import ErrorPage from "./pages/ErrorPage";

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
          const response = await fetch("https://fakestoreapi.com/products");
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
        },
        hydrateFallbackElement: <h2>Loading...</h2>,
      },
      {
        path: "product/:id",
        element: <Product />,
        loader: ProductLoader,
        hydrateFallbackElement: <h2>Loading...</h2>,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
];

export default routes;
