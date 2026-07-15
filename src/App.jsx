import { useState, createContext, useContext } from "react";
import { Outlet, useNavigation } from "react-router";
import NavBar from "./components/NavBar";
import { CartProvider } from "./contexts/CartContext";

function App() {
  // const [count, setCount] = useState(0);
  // const cartItems = [];
  // const cartItems = useContext(CartContext);
  const navigation = useNavigation();
  return (
    <CartProvider>
      <NavBar />
      {navigation.state === "loading" ? "Loading..." : <Outlet />}{" "}
      {/* <section id="center"> */}
      {/*   <button */}
      {/*     type="button" */}
      {/*     className="counter" */}
      {/*     onClick={() => setCount((count) => count + 1)} */}
      {/*   > */}
      {/*     Count is {count} */}
      {/*   </button> */}
      {/* </section> */}
    </CartProvider>
  );
}

export default App;
