import { useState } from "react";
import { createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addItemToCart = (item) => {
    setCartItems([item, ...cartItems]);
  };

  const removeItemFromCart = (item) => {
    let index = cartItems.findIndex((it) => it.id === item.id);
    cartItems.splice(index, 1);
    setCartItems([...cartItems]);
  };

  return (
    <CartContext value={[cartItems, addItemToCart, removeItemFromCart]}>
      {children}
    </CartContext>
  );
};
