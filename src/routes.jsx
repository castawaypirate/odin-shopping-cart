import App from "./components/App";
import Home from "./components/Home";
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import ErrorPage from "./components/ErrorPage";
// import { Test } from "./Test";
// import Test1 from "./Test1";
// import Test2 from "./Test2";
// import Test3 from "./Test3";
// import SmallTest from "./SmallTest";

const dummyLoader = () => new Promise((resolve) => setTimeout(resolve, 2000));

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
        path: "/shop",
        element: <Shop />,
        loader: async () => {
          const response = await fetch("https://fakestoreapi.com/products");
          dummyLoader();
          return response.json();
        },
      },
      {
        path: "/cart",
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
