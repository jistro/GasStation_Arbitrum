import { FaBars, FaCheck, FaXmark, FaExclamation } from "react-icons/fa6";
import styles from "./tableNodes.module.css";

export default function TableGoerliNode() {
  return (
    <>
      <div>
        <div className={styles.tableOne}>
          <img src="/alchLogo.png" alt="infura" />
          <div>
            <h2>Alchemy</h2>
            <p>Free tier has 300 million CUs per month</p>
            <p>All tiers get Node APIs</p>
            <a href="https://www.alchemy.com/" target="_blank">
              https://www.alchemy.com/
            </a>
          </div>
        </div>
      </div>
      <div>
        <div className={styles.tableThree}>
          <img src="/infura.png" alt="infura" />
          <div>
            <h2>Alchemy</h2>
            <p>Free tier has 100,000 Total Requests per day</p>
            <a href="https://infura.io/" target="_blank">
              https://www.infura.io/
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
