import { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { CartContext } from "../contexts/CartContext";
import styles from "./Cart.module.css";

export default function Cart() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(new Set());
  const [search, setSearch] = useState("");
  const [cartItems, addItemToCart, removeItemFromCart] =
    useContext(CartContext);

  function filterProducts(title) {
    if (search === "") {
      return true;
    }
    if (title.includes(search.toLowerCase())) {
      return true;
    }
    return false;
  }

  const orderItems = useMemo(() => {
    let arr = [];
    for (let product of cartItems) {
      let index = arr.findIndex((it) => it.title === product.title);
      if (index === -1) {
        arr.push({
          title: product.title,
          image: product.image,
          price: product.price,
          selected: false,
          count: 1,
        });
      } else {
        arr[index].count = arr[index].count + 1;
      }
    }
    return arr;
  }, [cartItems]);

  const total = useMemo(() => {
    let sum = 0;
    for (let product of cartItems) {
      sum += product.price;
      sum = parseFloat(sum.toFixed(2));
    }
    return sum;
  }, [cartItems]);

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  return (
    <div className={styles.cartContainer}>
      <h1>Your Cart</h1>
      {orderItems.length === 0 ? (
        <p>Your cart is empty...</p>
      ) : (
        <div className={styles.cartContent}>
          <input
            placeholder="Search your loot..."
            type="search"
            value={search}
            onChange={handleSearch}
          />

          <div className={styles.checkboxList}>
            <div className={styles.checkboxWrapper}>
              {/* <input */}
              {/*   type="checkbox" */}
              {/*   id="selectAll" */}
              {/*   name="selectAll" */}
              {/*   value="all" */}
              {/*   checked={}  */}
              {/*    onChange={} */}
              {/* /> */}
              <label htmlFor="selectAll">Select All</label>
            </div>

            <div className={styles.cartItemsList}>
              {orderItems.map(
                (item, index) =>
                  filterProducts(item.title.toLowerCase()) && (
                    <div key={item.title} className={styles.cartItem}>
                      <div className={styles.checkboxWrapper}>
                        <input
                          type="checkbox"
                          id={`custom-cart-checkbox-${index}`}
                          name={`custom-cart-checkbox-${index}`}
                          value={item.title}
                        />
                        <label htmlFor={`custom-cart-checkbox-${index}`}>
                          {item.title}
                        </label>
                      </div>
                      <p>{item.price} gp</p>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() =>
                            addItemToCart(
                              cartItems.find((it) => it.title === item.title),
                            )
                          }
                        >
                          +
                        </button>
                        <span>{item.count}</span>
                        <button
                          onClick={() =>
                            removeItemFromCart(
                              cartItems.find((it) => it.title === item.title),
                            )
                          }
                        >
                          -
                        </button>
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      )}

      <button onClick={() => navigate("/shop")}>Back to Shopping</button>
      {cartItems.length !== 0 && <button>Pay {total} gp</button>}
    </div>
  );
}
