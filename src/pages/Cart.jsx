import { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { CartContext } from "../contexts/CartContext";
import styles from "./Cart.module.css";

export default function Cart() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [
    cartItems,
    addItemToCart,
    removeItemFromCart,
    checked,
    setChecked,
    emptyCart,
  ] = useContext(CartContext);

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
    let items = {};
    for (let product of cartItems) {
      if (!items[product.id]) {
        items[product.id] = { product: product, count: 1 };
      } else {
        items[product.id].count += 1;
      }
    }
    return items;
  }, [cartItems]);

  const totalDamage = useMemo(() => {
    let sum = 0;
    for (let item of cartItems) {
      if (checked.has(item.id)) {
        sum += item.price;
        sum = parseFloat(sum.toFixed(2));
      }
    }
    return sum;
  }, [cartItems, checked]);

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  function handleSelectAll() {
    let tempSet = new Set(checked);
    let products = Object.values(orderItems);
    if (tempSet.size < products.length) {
      for (let item of products) {
        if (!tempSet.has(item.product.id)) {
          tempSet.add(item.product.id);
        }
      }
    } else {
      for (let item of products) {
        tempSet.delete(item.product.id);
      }
    }

    setChecked(tempSet);
  }

  function handleSelect(item) {
    let tempSet = new Set(checked);
    if (tempSet.has(item.id)) {
      tempSet.delete(item.id);
    } else {
      tempSet.add(item.id);
    }
    setChecked(tempSet);
  }

  return (
    <div className={styles.cartContainer}>
      <h1>Your Cart</h1>
      {Object.values(orderItems).length === 0 ? (
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
            <div className={styles.topBar}>
              <div className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  id="selectAll"
                  name="selectAll"
                  value="all"
                  checked={Object.values(orderItems).length === checked.size}
                  onChange={handleSelectAll}
                />
                <label htmlFor="selectAll">Select All</label>
              </div>
              <button
                onClick={emptyCart}
                disabled={checked.size === 0}
                className={styles.iconContainer}
              >
                <svg
                  className={`${checked.size > 0 ? styles.active : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
              </button>
            </div>
            <div className={styles.cartItemsList}>
              {Object.values(orderItems).map(
                (item, index) =>
                  filterProducts(item.product.title.toLowerCase()) && (
                    <div key={item.product.id} className={styles.cartItem}>
                      <div>
                        <div className={styles.checkboxWrapper}>
                          <input
                            type="checkbox"
                            id={`custom-cart-checkbox-${index}`}
                            name={`custom-cart-checkbox-${index}`}
                            value={item.product.title}
                            checked={checked.has(item.product.id)}
                            onChange={() => handleSelect(item.product)}
                          />
                          <label htmlFor={`custom-cart-checkbox-${index}`}>
                            {item.product.title}
                          </label>
                        </div>
                        <p>
                          Item Total:{" "}
                          {parseFloat(
                            (item.product.price * item.count).toFixed(2),
                          )}{" "}
                          gp
                        </p>
                        <div className={styles.quantityControls}>
                          <button onClick={() => addItemToCart(item.product)}>
                            +
                          </button>
                          <span>{item.count}</span>
                          <button
                            onClick={() => removeItemFromCart(item.product)}
                          >
                            -
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          removeItemFromCart(item.product, item.count)
                        }
                        className={styles.iconContainer}
                      >
                        <svg
                          className={styles.active}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 -960 960 960"
                        >
                          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                        </svg>
                      </button>
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.cartActions}>
        <button onClick={() => navigate("/shop")}>Back to Shopping</button>
        {cartItems.length !== 0 && <button>Pay {totalDamage} gp</button>}
      </div>
    </div>
  );
}
