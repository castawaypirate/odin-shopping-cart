import { useContext } from "react";
import { useNavigate, useLoaderData } from "react-router";
import Card from "../components/Card";
import { CartContext } from "../contexts/CartContext";
import styles from "./Shop.module.css";

export default function Shop() {
  const navigate = useNavigate();
  const [categories, products] = useLoaderData();
  const [cartItems, addItemToCart, removeItemFromCart] =
    useContext(CartContext);

  console.log(products);

  const navigateToProduct = (id) => {
    navigate(`/product/${id}`);
  };

  function handleChage(e) {
    let value = e.target.value;
    console.log(value);
  }

  return (
    <>
      <div className={styles.shopControls}>
        <input type="search" />
        <select defaultValue={"all"} onChange={handleChage}>
          <option value="all">All Categories</option>
          {categories.map((option) => {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          })}
        </select>
      </div>
      <div className={styles.cardGrid}>
        {products.map((item) => (
          <Card
            click={navigateToProduct}
            handleAdd={addItemToCart}
            handleRemove={removeItemFromCart}
            count={cartItems.filter((it) => it.id === item.id).length}
            key={item.id}
            product={item}
          />
        ))}
      </div>
    </>
  );
}
