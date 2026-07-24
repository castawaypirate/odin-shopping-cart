import { useState } from "react";
import { createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ initialItems = [], children }) => {
  const [cartItems, setCartItems] = useState(initialItems);
  const [checked, setChecked] = useState(new Set());

  const addItemToCart = (item) => {
    let tempSet = new Set(checked);
    // if item alredy in the cart adding a new one should not change the checked state of it
    if (
      cartItems.findIndex((it) => it.id === item.id) === -1 &&
      !tempSet.has(item.id)
    ) {
      tempSet.add(item.id);
    }
    setChecked(tempSet);
    setCartItems([item, ...cartItems]);
  };

  const removeItemFromCart = (item, count = 1) => {
    let tempSet = new Set(checked);
    for (let i = 0; i < count; i++) {
      let index = cartItems.findIndex((it) => it.id === item.id);
      // double check if exists before removing
      if (index !== -1) {
        cartItems.splice(index, 1);
        // if item we are going to remove is in the checked set remove it from there only if is the last of its kind
        let itemCount = cartItems.filter((it) => it.id === item.id).length;
        if (tempSet.has(item.id) && itemCount === 0) {
          tempSet.delete(item.id);
        }
      }
    }

    setChecked(tempSet);
    setCartItems([...cartItems]);
  };

  const emptyCart = () => {
    setChecked(new Set());
    setCartItems([]);
  };

  return (
    <CartContext
      value={[
        cartItems,
        addItemToCart,
        removeItemFromCart,
        checked,
        setChecked,
        emptyCart,
      ]}
    >
      {children}
    </CartContext>
  );
};
