import App from "./App";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Product, { loader as ProductLoader } from "./pages/Product";
import ErrorPage from "./pages/ErrorPage";

const dummyLoader = () => new Promise((resolve) => setTimeout(resolve, 2000));

// mayde do another request for the specific product to see how loaders work in more detail

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
          dummyLoader();
          return response.json();
        },
      },
      { path: "product/:id", element: <Product />, loader: ProductLoader },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },

  // {
  //   path: "test",
  //   element: <Test />,
  //   children: [
  //     // { index: true, element: <DefaultProfile /> },
  //     { path: "test2/:kappa", element: <Test2 /> },
  //     { path: "test3", element: <Test3 /> },
  //   ],
  // },
  // {
  //   path: "test1",
  //   element: <Test1 />,
  // },
  // {
  //   path: "smalltest",
  //   element: <SmallTest />,
  // },
  // {
  //   path: "profile/:name",
  //   element: <Profile />,
  // },
];

export default routes;
