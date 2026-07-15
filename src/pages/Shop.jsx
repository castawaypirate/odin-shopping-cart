import { useContext } from "react";
import { useLoaderData } from "react-router";
import Card from "../components/Card";
import { CartContext } from "../contexts/CartContext";
import styles from "./Shop.module.css";

export default function Shop() {
  const products = useLoaderData();
  const [cartItems, addItemToCart, removeItemFromCart] =
    useContext(CartContext);

  console.log(products);

  // const something = (obj) => {
  //   let temp = [];
  //   for (let key in obj) {
  //     if (typeof obj[key] !== "object") {
  //       temp.push(obj[key]);
  //     }
  //   }
  //   return (
  //     <>
  //       {temp.map((item) => (
  //         <>
  //           <p>{item}</p>
  //         </>
  //       ))}
  //       <hr />
  //     </>
  //   );
  // };

  return (
    <div className={styles.cardGrid}>
      {/* <h1>Shop</h1> */}
      {products.map((item) => (
        <Card
          handleAdd={addItemToCart}
          handleRemove={removeItemFromCart}
          count={cartItems.filter((it) => it.id === item.id).length}
          key={item.id}
          product={item}
        />
      ))}
    </div>
  );
}
