import { NavLink } from "react-router";

function NavBar() {
  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/cart">Cart</NavLink>
      </nav>
    </>
  );
}

export default NavBar;
