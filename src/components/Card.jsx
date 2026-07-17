import { useNavigate } from "react-router";
import CartIcon from "./Icons/CartIcon";

import styles from "./Card.module.css";

export default function Card({
  click,
  handleAdd,
  handleRemove,
  product,
  count,
}) {
  let navigate = useNavigate();
  const addItem = (product) => {
    handleAdd(product);
  };

  const removeItem = (product) => {
    handleRemove(product);
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
