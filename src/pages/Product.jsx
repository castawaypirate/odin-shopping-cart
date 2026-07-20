import { useState, useContext } from "react";
import { useLoaderData, useNavigate } from "react-router";
import CartIcon from "../components/Icons/CartIcon";
import { CartContext } from "../contexts/CartContext";

import styles from "./Product.module.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Product() {
  const [loading, setLoading] = useState(true);
  const productData = useLoaderData();
  const navigate = useNavigate();
  const [cartItems, addItemToCart, removeItemFromCart] =
    useContext(CartContext);

  function handleOnLoad() {
    setLoading(false);
  }

  const addItem = (product) => {
    addItemToCart(product);
  };

  const removeItem = (product) => {
    removeItemFromCart(product);
  };

  const count = () => {
    if (cartItems.length === 0) {
      return 0;
    }
    return cartItems.filter((item) => item.id === productData.id).length;
  };

  return (
    <div className={styles.productContainer}>
      <div>
        {loading && <h4>Loading...</h4>}
        <img
          style={{ display: loading ? "none" : "block" }}
          onLoad={handleOnLoad}
          src={productData.image}
          alt={productData.title}
        />
      </div>
      <h2>{productData.title}</h2>
      <p>Price: {productData.price} gp</p>
      <br />
      <div>
        <h3>Category</h3>
        <p>{productData.category}</p>
      </div>
      <br />
      <div>
        <h3>Description</h3>
        <p>{productData.description}</p>
      </div>
      <br />
      <p>
        <strong>{productData.rating.rate}/5</strong> ({productData.rating.count}
        )
      </p>
      <div className={styles.cartControls}>
        {count() === 0 ? (
          <button
            onClick={() => addItem(productData)}
            className={styles.cartIcon}
          >
            <CartIcon size={24} />
          </button>
        ) : (
          <>
            <div className={styles.quantityControls}>
              <button onClick={() => addItem(productData)}>+</button>
              <span>{count()}</span>
              <button onClick={() => removeItem(productData)}>-</button>
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

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ params }) {
  const url = `${API_URL}/products/${params.id}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Response(response.statusText, {
      status: response.status,
    });
  } else {
    const responseData = await response.json();
    return responseData;
  }
}
