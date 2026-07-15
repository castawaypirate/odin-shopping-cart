import { useEffect, useRef } from "react";
import CartIcon from "./Icons/CartIcon";

import styles from "./Card.module.css";

export default function Card({ product }) {
  return (
    <div className={styles.card}>
      <div className={styles.imgContainer}>
        <img src={product.image} />
      </div>
      <div className={styles.productDetails}>
        <p title={product.title} className={styles.productDesc}>
          {product.title}
        </p>
        <p>{product.price}</p>
        <div className={styles.cartControls}>
          <button className={styles.cartIcon}>
            <CartIcon size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
