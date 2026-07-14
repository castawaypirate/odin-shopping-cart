import { useState } from "react";
import { Outlet, useNavigation } from "react-router";
import NavBar from "./NavBar";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const navigation = useNavigation();
  return (
    <>
      <NavBar />
      {navigation.state === "loading" ? "loading" : <Outlet />}{" "}
      <section id="center">
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>
    </>
  );
}

export default App;
