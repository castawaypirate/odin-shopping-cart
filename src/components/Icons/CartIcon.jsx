import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import styles from "./Icon.module.css";

export default function CartIcon({ size, active, header }) {
  const [cartItems, addItemToCart, removeItemFromCart] =
    useContext(CartContext);
  const isActive = active ? `${styles.active}` : "";
  const classes = `${styles.navIcon} ${isActive}`;

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width={size}
        fill="#1f1f1f"
        className={classes}
      >
        <path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
      </svg>
      {header && cartItems.length > 0 && (
        <span className={styles.cartCounter}>{cartItems.length}</span>
      )}
    </div>
  );
}
