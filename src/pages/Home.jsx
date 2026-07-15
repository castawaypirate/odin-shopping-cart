import { useNavigate } from "react-router";
import styles from "./Home.module.css";

export default function Home() {
  let navigate = useNavigate();
  return (
    <>
      <h1>Welcome to my shop!</h1>
      <h2>Things are for real here...</h2>
      <h3>Certainly real things...</h3>
      <h4>Buy before everything's gone...</h4>
      <h5>This is your last chance...</h5>
      <h6>Goods won't wait longer...</h6>
      <div className={styles.h7}>Don't walk away from these deals...</div>
      <div className={styles.h8}>Can you still hear me?</div>
      <div className={styles.h9}>I have so much inventory left, or not?</div>
      <div className={styles.h10}>
        You are going to need a magnifying glass...
      </div>
      <div className={styles.h11}>Please, just buy one thing...</div>
      <div className={styles.h12}>The void is consuming my storefront...</div>
      <div className={styles.h13}>Are you still reading this?</div>
      <div className={styles.h14}>Squint harder...</div>
      <div className={styles.h15}>It's getting so dark...</div>
      <div className={styles.h16}>Just one click...</div>
      <div className={styles.h17}>Are you still there?</div>
      <div className={styles.h18}>Hello...?</div>
      <div className={styles.h19}>fading...</div>
      <div className={styles.h20}>...</div>
      <div className={styles.h21}>
        You went to great trouble looking at the HTML. Well Done! Here's your
        cookie
      </div>
      <button onClick={() => navigate("/shop")}>Start shopping</button>
    </>
  );
}
