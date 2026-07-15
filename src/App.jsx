import { useState } from "react";
import { Outlet, useNavigation } from "react-router";
import NavBar from "./components/NavBar";

function App() {
  // const [count, setCount] = useState(0);
  const navigation = useNavigation();
  return (
    <>
      <NavBar />
      {navigation.state === "loading" ? "Loading..." : <Outlet />}{" "}
      {/* <section id="center"> */}
      {/*   <button */}
      {/*     type="button" */}
      {/*     className="counter" */}
      {/*     onClick={() => setCount((count) => count + 1)} */}
      {/*   > */}
      {/*     Count is {count} */}
      {/*   </button> */}
      {/* </section> */}
    </>
  );
}

export default App;
