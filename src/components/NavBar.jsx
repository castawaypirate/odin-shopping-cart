import { NavLink } from "react-router";
import HomeIcon from "./Icons/HomeIcon";
import ShopIcon from "./Icons/ShopIcon";
import CartIcon from "./Icons/CartIcon";
import styles from "./NavBar.module.css";

function NavBar() {
  return (
    <nav className={styles.navBar}>
      <NavLink to="/">
        {({ isActive }) => <HomeIcon size={36} active={isActive} />}
      </NavLink>
      <NavLink to="/shop">
        {({ isActive }) => <ShopIcon size={36} active={isActive} />}
      </NavLink>
      <NavLink to="/cart">
        {({ isActive }) => (
          <CartIcon size={36} active={isActive} header={true} />
        )}
      </NavLink>
    </nav>
  );
}

export default NavBar;
