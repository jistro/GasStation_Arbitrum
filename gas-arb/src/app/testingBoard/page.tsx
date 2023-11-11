"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useEffect } from "react";
import Head from "next/head";

import HamburgerMenu from "@/components/hamburgerMenu";
import TableGoerliFaucets from "@/components/tableGoerliFaucets";

import { utils, providers } from "ethers";
import TableSepoliaFaucets from "@/components/tableSepoliaFaucets";

export default function testingBoard() {
  const [testnet, setTestnet] = useState("goerli");

  const listenSelectTestnet = () => {
    const testnetElement = document.getElementById(
      "testnet"
    ) as HTMLSelectElement;
    if (testnetElement) {
      const testnet = testnetElement.value;
      if (testnet === "goerli") {
        setTestnet("goerli");
      } else if (testnet === "sepolia") {
        setTestnet("sepolia");
      }
      console.log(testnet);
    }
  };

  return (
    <>
      <Head>
        <title>Gas hub</title>
        <meta
          charSet="utf-8"
          name="Gas hub for Arbitrum"
          content="Gas hub is a tool for Arbitrum users to find the gas prices and gas fees for their transactions."
        />
      </Head>
      <main className={styles.main}>
        <header>
          <Image
            src="/LOGO.png"
            alt="Arb Gas Station Logo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "25%", height: "auto" }} // optional
          />
          <HamburgerMenu numberBlocker={2} />
        </header>
        <div className={styles.container}>
          <div className={styles.descriptionText}>
            <h1>Testing Board</h1>
            <p>
              In the development of smart contracts, it is important to test the
              contracts before deploying them to the mainnet.
            </p>
            <p>
              Arbitrum provides a testnet for developers to test their
              contracts. For the deployment of contracts, the testnet requires
              testnet ETH.
            </p>
            <p>
              The faucet provides testnet ETH for developers to test their
              contracts.
            </p>
          </div>
          <div className={styles.container__selectTestnet}>
            <select
              className={styles.selectTestnet}
              id="testnet"
              onChange={listenSelectTestnet}
            >
              <option value="goerli">Goerli testnet</option>
              <option value="sepolia">Sepolia testnet</option>
            </select>
          </div>
          {testnet === "goerli" ? (
            <div className={styles.testnetContainer}>
              <h2>Goerli Faucets</h2>
              <p>There are several Goerli faucets that provide testnet ETH</p>
              <TableGoerliFaucets />
            </div>
          ) : (
            <div className={styles.testnetContainer}>
              <h2>Sepolia Faucet</h2>
              <p>
                There is only one Sepolia faucet that provides testnet ETH
              </p>
              <TableSepoliaFaucets />
            </div>
          )}
        </div>
      </main>
      <footer className={styles.header}>
        <p
          style={{
            textAlign: "center",
            fontFamily: "monospace",
          }}
        >
          Made with ❤️ by{" "}
          <a
            href="https://twitter.com/jistro"
            style={{ color: "white", textDecoration: "none" }}
          >
            @jistro
          </a>{" "}
          for the arbitrum community (💙,🧡)
        </p>
        <br />
        <p
          style={{
            fontSize: "10px",
            color: "gray",
            textAlign: "center",
            fontFamily: "monospace",
            paddingTop: "5px",
          }}
        >
          Disclaimer: This information is sourced using{" "}
          <a
            href="https://www.npmjs.com/package/@arbitrum/sdk"
            style={{ color: "gray", textDecoration: "none" }}
          >
            Arbitrum SDK
          </a>{" "}
          and fetching data from{" "}
          <a
            href="https://coinbase.com"
            style={{ color: "gray", textDecoration: "none" }}
          >
            coinbase.com
          </a>{" "}
          exchange rates API. The developer assumes no liability for any losses
          or damages resulting from the use of this information. Please note
          that all gas estimates are based on the current gas price and may not
          be entirely precise.
        </p>
      </footer>
    </>
  );
}
