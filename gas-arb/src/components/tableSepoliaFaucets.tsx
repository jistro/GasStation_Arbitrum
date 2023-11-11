import { FaBars, FaCheck, FaXmark, FaExclamation } from "react-icons/fa6";
import styles from "./tableFaucets.module.css";

export default function TableSepoliaFaucets() {
  return (
    <div>
      <div className={styles.tableOne}>
        <h2>Quick node faucet</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p>
            <FaCheck color="green" size="12px" /> Gives 0.025 ETH per day
          </p>
          <p>
            <FaExclamation color="yellow" size="12px" /> You can make a tweet to
            get 0.05 ETH per day
          </p>

          <p>
            <FaXmark color="red" size="12px" /> You need hold at least 0.0001
            ETH on ethereum mainnet to get testnet ETH
          </p>
        </div>
        <a
          href="https://faucet.quicknode.com/arbitrum/sepolia"
          target="_blank"
        >
          https://faucet.quicknode.com/arbitrum/sepolia
        </a>
      </div>
     
    </div>
  );
}
