import { NavLink } from "react-router";
import HomeIcon from "./Icons/HomeIcon";
import ShopIcon from "./Icons/ShopIcon";
import CartIcon from "./Icons/CartIcon";
import styles from "./NavBar.module.css";

function NavBar() {
  return (
    <nav className={styles.navBar}>
      <NavLink to="/" aria-label="home">
        {({ isActive }) => <HomeIcon size={36} active={isActive} />}
      </NavLink>
      <NavLink to="/shop" aria-label="shop">
        {({ isActive }) => <ShopIcon size={36} active={isActive} />}
      </NavLink>
      <NavLink to="/cart" aria-label="cart">
        {({ isActive }) => (
          <CartIcon size={36} active={isActive} header={true} />
        )}
      </NavLink>
    </nav>
  );
}

export default NavBar;
