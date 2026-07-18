import { useContext, useState } from "react";
import { useNavigate, useLoaderData } from "react-router";
import Card from "../components/Card";
import { CartContext } from "../contexts/CartContext";
import styles from "./Shop.module.css";

export default function Shop() {
  const navigate = useNavigate();
  const [categories, products] = useLoaderData();
  const [categoryChecked, setCategoryChecked] = useState(new Set());
  const [search, setSearch] = useState("");
  const [cartItems, addItemToCart, removeItemFromCart] =
    useContext(CartContext);

  const navigateToProduct = (id) => {
    navigate(`/product/${id}`);
  };

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  function handleCategoryChecked(category) {
    if (categoryChecked.has(category)) {
      categoryChecked.delete(category);
    } else {
      categoryChecked.add(category);
    }
    setCategoryChecked(new Set(categoryChecked));
  }

  function handleClear() {
    setCategoryChecked(new Set());
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
                    id={`custom-category-checkbox-${index}`}
                    name={categ.toLowerCase()}
                    value={categ.toLowerCase()}
                    checked={categoryChecked.has(categ.toLowerCase())}
                    onChange={() => handleCategoryChecked(categ.toLowerCase())}
                  />
                  <label htmlFor={`custom-category-checkbox-${index}`}>
                    {categ}
                  </label>
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
            (categoryChecked.size === 0 ||
              categoryChecked.has(item.category)) &&
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
