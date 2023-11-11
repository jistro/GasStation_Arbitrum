"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useEffect } from "react";
import Head from "next/head";

import HamburgerMenu from "@/components/hamburgerMenu";

import { utils, providers } from "ethers";
import { addDefaultLocalNetwork } from "@arbitrum/sdk";
import { NodeInterface__factory } from "@arbitrum/sdk/dist/lib/abi/factories/NodeInterface__factory";
import { NODE_INTERFACE_ADDRESS } from "@arbitrum/sdk/dist/lib/dataEntities/constants";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY_ARB;

export default function Home() {
  var timeRefresh = Math.floor(Date.now() / 1000);
  const [currencyToETH, setCurrencyToETH] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [nameCurrency, setNameCurrency] = useState("USD");
  const [currency_ETH, setCurrency_ETH] = useState(0);
  const [gasPrice, setGasPrice] = useState<any>("0");
  const [txEstimateGas, setTxEstimateGas] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [customGasPrice, setCustomGasPrice] = useState(0);

  const findCostOfUnitOfGas = async () => {
    const destinationAddress = "0x63c3774531EF83631111Fe2Cf01520Fb3F5A68F7";
    const txData = "0x";
    const baseL2Provider = new providers.StaticJsonRpcProvider(
      "https://arb1.arbitrum.io/rpc"
    );
    //addDefaultLocalNetwork();

    // Instantiation of the NodeInterface object
    const nodeInterface = NodeInterface__factory.connect(
      NODE_INTERFACE_ADDRESS,
      baseL2Provider
    );

    // Getting the estimations from NodeInterface.GasEstimateComponents()
    // ------------------------------------------------------------------
    const gasEstimateComponents =
      await nodeInterface.callStatic.gasEstimateComponents(
        destinationAddress,
        false,
        txData,
        {
          blockTag: "latest",
        }
      );

    // Getting useful values for calculating the formula
    const l1GasEstimated = gasEstimateComponents.gasEstimateForL1;
    const l2GasUsed = gasEstimateComponents.gasEstimate.sub(
      gasEstimateComponents.gasEstimateForL1
    );
    const l2EstimatedPrice = gasEstimateComponents.baseFee;
    const l1EstimatedPrice = gasEstimateComponents.l1BaseFeeEstimate.mul(16);

    // Calculating some extra values to be able to apply all variables of the formula
    // -------------------------------------------------------------------------------
    // NOTE: This one might be a bit confusing, but l1GasEstimated (B in the formula) is calculated based on l2 gas fees
    const l1Cost = l1GasEstimated.mul(l2EstimatedPrice);
    // NOTE: This is similar to 140 + utils.hexDataLength(txData);
    const l1Size = l1Cost.div(l1EstimatedPrice);

    // Getting the result of the formula
    // ---------------------------------
    // Setting the basic variables of the formula
    const P = l2EstimatedPrice;
    const L2G = l2GasUsed;
    const L1P = l1EstimatedPrice;
    const L1S = l1Size;

    // L1C (L1 Cost) = L1P * L1S
    const L1C = L1P.mul(L1S);

    // B (Extra Buffer) = L1C / P
    const B = L1C.div(P);

    // G (Gas Limit) = L2G + B
    const G = L2G.add(B);

    // TXFEES (Transaction fees) = P * G
    const TXFEES = P.mul(G);

    console.log("Gas estimation components");
    console.log("-------------------");
    console.log(`P (L2 Gas Price) = ${utils.formatUnits(P, "gwei")} gwei`);
    console.log(P);
    return utils.formatUnits(P, "gwei");
  };

  const calculateGasFee = async (
    destinationAddress: string,
    txData: string
  ) => {
    const baseL2Provider = new providers.StaticJsonRpcProvider(
      "https://arb1.arbitrum.io/rpc"
    );
    //addDefaultLocalNetwork();

    // Instantiation of the NodeInterface object
    const nodeInterface = NodeInterface__factory.connect(
      NODE_INTERFACE_ADDRESS,
      baseL2Provider
    );

    // Getting the estimations from NodeInterface.GasEstimateComponents()
    // ------------------------------------------------------------------
    const gasEstimateComponents =
      await nodeInterface.callStatic.gasEstimateComponents(
        destinationAddress,
        false,
        txData,
        {
          blockTag: "latest",
        }
      );

    // Getting useful values for calculating the formula
    const l1GasEstimated = gasEstimateComponents.gasEstimateForL1;
    const l2GasUsed = gasEstimateComponents.gasEstimate.sub(
      gasEstimateComponents.gasEstimateForL1
    );
    const l2EstimatedPrice = gasEstimateComponents.baseFee;
    const l1EstimatedPrice = gasEstimateComponents.l1BaseFeeEstimate.mul(16);

    // Calculating some extra values to be able to apply all variables of the formula
    // -------------------------------------------------------------------------------
    // NOTE: This one might be a bit confusing, but l1GasEstimated (B in the formula) is calculated based on l2 gas fees
    const l1Cost = l1GasEstimated.mul(l2EstimatedPrice);
    // NOTE: This is similar to 140 + utils.hexDataLength(txData);
    const l1Size = l1Cost.div(l1EstimatedPrice);

    // Getting the result of the formula
    // ---------------------------------
    // Setting the basic variables of the formula
    const P = l2EstimatedPrice;
    const L2G = l2GasUsed;
    const L1P = l1EstimatedPrice;
    const L1S = l1Size;

    // L1C (L1 Cost) = L1P * L1S
    const L1C = L1P.mul(L1S);

    // B (Extra Buffer) = L1C / P
    const B = L1C.div(P);

    // G (Gas Limit) = L2G + B
    const G = L2G.add(B);

    // TXFEES (Transaction fees) = P * G
    const TXFEES = P.mul(G);

    console.log("Gas estimation components");
    console.log("-------------------");
    console.log(
      `Full gas estimation = ${gasEstimateComponents.gasEstimate.toNumber()} units`
    );
    console.log(`L2 Gas (L2G) = ${L2G.toNumber()} units`);
    console.log(`L1 estimated Gas (L1G) = ${l1GasEstimated.toNumber()} units`);

    console.log(`P (L2 Gas Price) = ${utils.formatUnits(P, "gwei")} gwei`);
    console.log(
      `L1P (L1 estimated calldata price per byte) = ${utils.formatUnits(
        L1P,
        "gwei"
      )} gwei`
    );
    console.log(`L1S (L1 Calldata size in bytes) = ${L1S} bytes`);

    console.log("-------------------");
    console.log(
      `Transaction estimated fees to pay = ${utils.formatEther(TXFEES)} ETH`
    );
    return gasEstimateComponents.gasEstimate.toNumber() as number;
  };

  const getGasPrice = async () => {
    try {
      const [result1, result2, result3, result4] = await Promise.all([
        calculateGasFee("0x007aB5199B6c57F7aA51bc3D0604a43505501a0C", "0x"),
        calculateGasFee(
          "0x007aB5199B6c57F7aA51bc3D0604a43505501a0C",
          "0xa9059cbb00000000000000000000000005f11b22d790fe64f7984fa4e5926c8f37216f1000000000000000000000000000000000000000000000003635c9adc5dea00000"
        ),
        calculateGasFee(
          "0x62383739D68Dd0F844103Db8dFb05a7EdED5BBE6",
          "0xa9059cbb00000000000000000000000062383739d68dd0f844103db8dfb05a7eded5bbe6000000000000000000000000000000000000000000000000000000002faf0800"
        ),
        calculateGasFee(
          "0x85E9c743172F1d7ed4652fdf27f571453CAf3CeB",
          "0x42842e0e000000000000000000000000837cb1cf798d2a8cbb898a86e1bb5ee0978233ab00000000000000000000000085e9c743172f1d7ed4652fdf27f571453caf3ceb00000000000000000000000000000000000000000000000000000000000009ce"
        ),
      ]);
      setTxEstimateGas([
        parseInt(String(result1)),
        parseInt(String(result2)),
        parseInt(String(result3)),
        parseInt(String(result4)),
        parseInt(String(result2)) + parseInt(String(result3)),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(true);
    }

    //hacer try catch de findCostOfUnitOfGas y setear el gasPrice
    try {
      const gasPrice = await findCostOfUnitOfGas();
      setGasPrice(gasPrice);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(true);
    }
    setLoading(false);
  };

  const getConvertionRate_currency_ETH = async () => {
    console.log("getConvertionRate_currency_ETH");
    try {
      const response = await fetch(
        `https://api.coinbase.com/v2/exchange-rates?currency=ETH`
      );
      const data = await response.json();
      const convertionRate_currency_ETH = data.data.rates.USD;
      /// usd btc arb eur mxn arg vef pen clp
      setCurrencyToETH([
        data.data.rates.USD,
        data.data.rates.BTC,
        data.data.rates.ARB,
        data.data.rates.EUR,
        data.data.rates.MXN,
        data.data.rates.ARS,
        data.data.rates.VEF,
        data.data.rates.PEN,
        data.data.rates.CLP,
      ]);
      console.log(currencyToETH);
      setCurrency_ETH(convertionRate_currency_ETH);
      console.log(currency_ETH);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getGasPrice();
    getConvertionRate_currency_ETH();
    timeRefresh = Math.floor(Date.now() / 1000);
  }, []);

  const getCustomGasPrice = () => {
    const inputID = document.getElementById("customGas") as HTMLInputElement;
    /// volvemos a inputID un numero
    if (inputID.value !== "") {
      const gasPriceValue = (
        (parseInt(inputID.value) * gasPrice) /
        100000000
      ).toFixed(9);
      setCustomGasPrice(parseFloat(gasPriceValue));
    } else {
      setCustomGasPrice(0);
    }
  };

  const convertGweiToEth = (units: any) => {
    const eth = units / 10000000000;
    return eth.toFixed(9);
  };

  const convertETHtoFIAT = (eth: any) => {
    const price = eth * currency_ETH;
    return price.toFixed(4);
  };

  const selectCurrency = () => {
    //obten de select el valor
    const selectID = document.getElementById("getPrice") as HTMLSelectElement;
    const selectedValue = selectID.value;
    //hacer un switch case para cada valor
    switch (selectedValue) {
      case "getUSD":
        setCurrency_ETH(currencyToETH[0]);
        setNameCurrency("USD");
        break;
      case "getBTC":
        setCurrency_ETH(currencyToETH[1]);
        setNameCurrency("BTC");
        break;
      case "getARB":
        setCurrency_ETH(currencyToETH[2]);
        setNameCurrency("ARB");
        break;
      case "getEUR":
        setCurrency_ETH(currencyToETH[3]);
        setNameCurrency("EUR");
        break;
      case "getMXN":
        setCurrency_ETH(currencyToETH[4]);
        setNameCurrency("MXN");
        break;
      case "getARG":
        setCurrency_ETH(currencyToETH[5]);
        setNameCurrency("ARG");
        break;
      case "getVEF":
        setCurrency_ETH(currencyToETH[6]);
        setNameCurrency("VEF");
        break;
      case "getPEN":
        setCurrency_ETH(currencyToETH[7]);
        setNameCurrency("PEN");
        break;
      case "getCLP":
        setCurrency_ETH(currencyToETH[8]);
        setNameCurrency("CLP");
        break;
      default:
        setCurrency_ETH(currencyToETH[0]);
        setNameCurrency("USD");
        break;
    }
    console.log(selectedValue);
    console.log(currencyToETH);
  };

  const convertUnixTime = (unixTime: number) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userTime = new Date(unixTime * 1000).toLocaleString("en-US", {
      timeZone: userTimeZone,
    });
    return userTime;
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
          <HamburgerMenu
            numberBlocker={1}
          />
          
        </header>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.lds_hourglass} />
            <div
              style={{
                fontSize: "15px",
                textAlign: "center",
                fontFamily: "monospace",
              }}
            >
              fetching data...
            </div>
          </div>
        ) : (
          <>
            <br />
            <div className={styles.twoTables}>
              <div className={styles.tableGas}>
                <p>L2 1 unit of gas = {gasPrice} gwei</p>
              </div>
            </div>
            <br />
            <p
              style={{
                fontSize: "10px",
                color: "#bababa",
                textAlign: "center",
                fontFamily: "monospace",
              }}
            >
              {`last update: ${convertUnixTime(
                timeRefresh
              )} -- ETH price: ${nameCurrency} ${currency_ETH}`}
            </p>
            <br />
            <h1> Gas estimate </h1>
            <br />
            <div className={styles.gasTXInfo}>
              <table className={styles.material_table}>
                <thead
                  style={{
                    borderRadius: "10px",
                  }}
                >
                  <tr>
                    <th className={styles.material_table__nameTransaction}>
                      Name of transaction
                    </th>
                    <th className={styles.material_table__gasPrice}>Gas</th>
                    <th>Eth cost</th>
                    <th className={styles.material_table__USDCost}>
                      <div
                        className={styles.material_table__USDCost__Container}
                      >
                        <select name="" id="getPrice" onChange={selectCurrency}>
                          <option value="getUSD" selected>
                            USD Price
                          </option>
                          <option value="getEUR">EUR Price</option>\
                          <option value="getARB">ARB Price</option>
                          <option value="getMXN">MXN Price</option>
                          <option value="getARG">ARG Price</option>
                          <option value="getVEF">VEF Price</option>
                          <option value="getPEN">PEN Price</option>
                          <option value="getCLP">CLP Price</option>
                        </select>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Eth transfer</td>
                    <td>{txEstimateGas[0]}</td>
                    <td className={styles.td_ethCost}>{`Ξ ${convertGweiToEth(
                      parseInt(txEstimateGas[0])
                    )}`}</td>
                    <td>{`$ ${convertETHtoFIAT(
                      convertGweiToEth(txEstimateGas[0])
                    )}`}</td>
                  </tr>
                  <tr>
                    <td>ARB transfer</td>
                    <td>{txEstimateGas[1]}</td>
                    <td className={styles.td_ethCost}>{`Ξ ${convertGweiToEth(txEstimateGas[1])}`}</td>
                    <td>{`$ ${convertETHtoFIAT(
                      convertGweiToEth(txEstimateGas[1])
                    )}`}</td>
                  </tr>
                  <tr>
                    <td>USDT transfer</td>
                    <td>{txEstimateGas[2]}</td>
                    <td className={styles.td_ethCost}>{`Ξ ${convertGweiToEth(txEstimateGas[2])}`}</td>
                    <td>{`$ ${convertETHtoFIAT(
                      convertGweiToEth(txEstimateGas[2])
                    )}`}</td>
                  </tr>
                  <tr>
                    <td>NFT transfer</td>
                    <td>{txEstimateGas[3]}</td>
                    <td className={styles.td_ethCost}>{`Ξ ${convertGweiToEth(txEstimateGas[3])}`}</td>
                    <td>{`$ ${convertETHtoFIAT(
                      convertGweiToEth(txEstimateGas[3])
                    )}`}</td>
                  </tr>
                  <tr>
                    <td>Swap</td>
                    <td>{txEstimateGas[4]}</td>
                    <td className={styles.td_ethCost}>{`Ξ ${convertGweiToEth(txEstimateGas[4])}`}</td>
                    <td>{`$ ${convertETHtoFIAT(
                      convertGweiToEth(txEstimateGas[4])
                    )}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.material_table__rawLeft}>
                      Custom gas
                    </td>
                    <td>
                      <input
                        type="number"
                        id="customGas"
                        name="customGas"
                        onChange={getCustomGasPrice}
                      />
                    </td>
                    <td className={styles.td_ethCost}>{`Ξ ${customGasPrice}`}</td>
                    <td
                      className={styles.material_table__rawRight}
                    >{`$ ${convertETHtoFIAT(customGasPrice)}`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
        <div style={{ paddingBottom: "50px" }} />
        <div
          style={{
            textAlign: "left",
            color: "#EDEDED",
            fontFamily: "monospace",
          }}
        >
          <h1 style={{ paddingBottom: "20px" }}>What is gas?</h1>
          <p>
            Gas is like fuel for the network, powering its operations. Every
            action requires computational effort measured in units called
            &quot;gwei.&quot; These units, denominated in ether (ETH), are paid
            as gas fees.
          </p>
          <br />
          <h1 style={{ paddingBottom: "20px" }}>Gas Fees in Arbitrum</h1>
          <p>
            In the context of Arbitrum, there are two parties that users pay
            when submitting a transaction:
          </p>
          <br />
          <p>
            The &quot;poster,&quot; if reimbursable, for L1 resources like L1
            calldata required to post the transaction.
          </p>
          <br />
          <p>
            The network fee account for L2 resources, which includes
            computation, storage, and other burdens borne by L2 nodes to process
            the transaction.
          </p>
          <br />
          <p>
            The L1 component of the fee is determined by the transaction&apos;s
            estimated contribution to its batch&apos;s size and the L2&apos;s
            view of the L1 data price, which adjusts dynamically to ensure fair
            compensation for batch posters. The L2 component includes
            traditional fees, like computation and storage charges, as well as
            additional fees for executing L2-specific precompiles, which are
            priced based on the resources used during execution.
          </p>
          <br />
          <p>
            Arbitrum establishes a minimum gas price floor, which is currently
            set at 0.1 gwei on Arbitrum One and 0.01 gwei on Nova.
          </p>
          <br />
          <p
            style={{
              fontFamily: "monospace",
              fontWeight: "bold",
            }}
          >
            In Arbitrum, transaction tips are not considered, as the sequencer
            prioritizes transactions on a first-come, first-served basis. Users
            pay the base fee, regardless of the tip they may choose.
          </p>
          <br />
          <p>
            {" "}
            For more information, please visit the official documentation:{" "}
          </p>
          <p>
            {" "}
            <a
              href="https://docs.arbitrum.io/arbos/gas"
              className={styles.link}
            >
              Arbitrum documentation -- Gas and Fees{" "}
            </a>
          </p>
          <p>
            {" "}
            <a
              href="https://ethereum.org/en/developers/docs/gas/"
              className={styles.link}
            >
              Ethereum documentation -- Gas and Fees{" "}
            </a>
          </p>
        </div>
        <div style={{ paddingBottom: "50px" }} />
      </main>
      <header className={styles.header}>
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
      </header>
    </>
  );
}
