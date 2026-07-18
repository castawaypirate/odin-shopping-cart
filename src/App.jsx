import { Outlet, useNavigation } from "react-router";
import NavBar from "./components/NavBar";
import { CartProvider } from "./contexts/CartContext";

function App() {
  // const navigation = useNavigation();
  return (
    <CartProvider>
      <NavBar />
      {/* {navigation.state === "loading" ? "Loading..." : <Outlet />}{" "} */}
      <Outlet />
    </CartProvider>
  );
}

export default App;
