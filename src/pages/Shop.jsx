import { useLoaderData } from "react-router";
import Card from "../components/Card";
import styles from "./Shop.module.css";

export default function Shop() {
  const products = useLoaderData();
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
        <Card key={item.id} product={item} />
      ))}
    </div>
  );
}
