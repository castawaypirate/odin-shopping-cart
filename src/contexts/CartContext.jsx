import { useState } from "react";
import { createContext } from "react";

// export const CartContext = createContext([]);

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addItemToCart = (item) => {
    setCartItems([item, ...cartItems]);
  };

  const removeItemFromCart = (item) => {
    setCartItems([...cartItems.filter((it) => it.id !== item.id)]);
  };

  return (
    <CartContext value={[cartItems, addItemToCart, removeItemFromCart]}>
      {children}
    </CartContext>
  );
};
