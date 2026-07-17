import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import CartIcon from "./Icons/CartIcon";
// import { CartContext } from "../contexts/CartContext";

import styles from "./Card.module.css";

export default function Card({
  click,
  handleAdd,
  handleRemove,
  product,
  count,
}) {
  let navigate = useNavigate();
  // const [count, setCount] = useState(0);
  // const cartItems = useContext(CartContext);
  const addItem = (product) => {
    // cartItems.push("test");
    // console.log(cartItems);
    handleAdd(product);
    // setCount(count + 1);
  };

  const removeItem = (product) => {
    handleRemove(product);
    // setCount(count - 1);
  };
  return (
    <div className={styles.card}>
      <div className={styles.cardContent} onClick={() => click(product.id)}>
        <div className={styles.imgContainer}>
          <img src={product.image} />
        </div>
        <div className={styles.productDetails}>
          <p title={product.title} className={styles.productDesc}>
            {product.title}
          </p>
          <p>{product.price} gp</p>
        </div>
      </div>
      <div className={styles.cartControls}>
        {count === 0 ? (
          <button onClick={() => addItem(product)} className={styles.cartIcon}>
            <CartIcon size={24} />
          </button>
        ) : (
          <>
            <div className={styles.quantityControls}>
              <button onClick={() => addItem(product)}>+</button>
              <span>{count}</span>
              <button onClick={() => removeItem(product)}>-</button>
            </div>
            <button
              className={styles.regularButton}
              onClick={() => navigate("/cart")}
            >
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
