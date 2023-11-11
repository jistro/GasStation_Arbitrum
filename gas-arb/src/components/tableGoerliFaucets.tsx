import { FaBars, FaCheck, FaXmark, FaExclamation } from "react-icons/fa6";
import styles from "./tableFaucets.module.css";

export default function TableGoerliFaucets() {
  return (
    <div>
      <div className={styles.tableOne}>
        <h2>Triangle platform faucet</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p>
            <FaCheck color="green" size="12px" /> Does not require any
            verification
          </p>
          <p>
            <FaXmark color="red" size="12px" /> Only 0.001 ETH per day
          </p>
        </div>
        <a
          href="https://faucet.triangleplatform.com/arbitrum/goerli"
          target="_blank"
        >
          https://faucet.triangleplatform.com/arbitrum/goerli
        </a>
      </div>
      <div className={styles.tableTwo}>
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
        <a href="https://faucet.quicknode.com/arbitrum/goerli" target="_blank">
          https://faucet.quicknode.com/arbitrum/goerli
        </a>
      </div>
      <div className={styles.tableThree}>
        <h2>Bware labs faucet</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p>
            <FaCheck color="green" size="12px" /> Does not require any
            verification
          </p>
          <p>
            <FaCheck color="green" size="12px" /> Gives 0.025 ETH per day
          </p>
          <p>
            <FaExclamation color="yellow" size="12px" /> You can make a tweet to
            get 0.075 ETH per day
          </p>
        </div>
        <a
          href="https://bwarelabs.com/faucets/arbitrum-testnet"
          target="_blank"
        >
          https://bwarelabs.com/faucets/arbitrum-testnet
        </a>
      </div>
    </div>
  );
}
