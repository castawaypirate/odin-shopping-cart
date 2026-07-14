import { useNavigate } from "react-router";

export default function Home() {
  let navigate = useNavigate();
  return (
    <>
      <h1>Welcome to my shop!</h1>
      <h2>We have only fake things...</h2>
      <button onClick={() => navigate("/shop")}>Start shopping</button>
    </>
  );
}
