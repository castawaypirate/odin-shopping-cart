import { useContext, useState } from "react";
import { useNavigate, useLoaderData } from "react-router";
import Card from "../components/Card";
import { CartContext } from "../contexts/CartContext";
import styles from "./Shop.module.css";

export default function Shop() {
  const navigate = useNavigate();
  const [categories, products] = useLoaderData();
  const [checked, setChecked] = useState(new Set());
  const [search, setSearch] = useState("");
  const [cartItems, addItemToCart, removeItemFromCart] =
    useContext(CartContext);

  console.log(products);
  console.log(categories);

  const navigateToProduct = (id) => {
    navigate(`/product/${id}`);
  };

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  function handleCategoryChecked(category) {
    if (checked.has(category)) {
      checked.delete(category);
    } else {
      checked.add(category);
    }
    setChecked(new Set(checked));
  }

  function handleClear() {
    setChecked(new Set());
  }

  function filterProducts(title) {
    if (search === "") {
      return true;
    }
    if (title.includes(search.toLowerCase())) {
      return true;
    }
    return false;
  }

  return (
    <>
      <div className={styles.shopControls}>
        <input
          placeholder="Search wares..."
          value={search}
          onChange={handleSearch}
          type="search"
        />
        <div className={styles.categoryControls}>
          <div className={styles.categoryCheckboxes}>
            {categories.map((categ, index) => {
              return (
                <div className={styles.checkboxWrapper} key={categ}>
                  <input
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    name={categ.toLowerCase()}
                    value={categ.toLowerCase()}
                    checked={checked.has(categ.toLowerCase())}
                    onChange={() => handleCategoryChecked(categ.toLowerCase())}
                  />
                  <label htmlFor={`custom-checkbox-${index}`}>{categ}</label>
                </div>
              );
            })}
          </div>
          <button className={styles.regularButton} onClick={handleClear}>
            Clear All
          </button>
        </div>
      </div>
      <div className={styles.cardGrid}>
        {products.map(
          (item) =>
            (checked.size === 0 || checked.has(item.category)) &&
            filterProducts(item.title.toLowerCase()) && (
              <Card
                click={navigateToProduct}
                handleAdd={addItemToCart}
                handleRemove={removeItemFromCart}
                count={cartItems.filter((it) => it.id === item.id).length}
                key={item.id}
                product={item}
              />
            ),
        )}
      </div>
    </>
  );
}
