"use client";
import styles from "./ethCalculator.module.css";
import React, { useState, useEffect } from "react";

const convert = require("ethereum-unit-converter");

export default function EthCalculator() {
  var timeRefresh = Math.floor(Date.now() / 1000);
  const [currencyToETH, setCurrencyToETH] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [nameCurrency, setNameCurrency] = useState("USD");
  const [currency_ETH, setCurrency_ETH] = useState(0);
  const [loading, setLoading] = useState(true);

  const getConvertionRate_currency_ETH = async () => {
    try {
      const response = await fetch(
        `https://api.coinbase.com/v2/exchange-rates?currency=ETH`
      );
      const data = await response.json();
      const convertionRate_currency_ETH = data.data.rates.USD;

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

      setCurrency_ETH(convertionRate_currency_ETH);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getConvertionRate_currency_ETH();
    timeRefresh = Math.floor(Date.now() / 1000);
    setLoading(false);
  }, []);

  const listenInput = (type: string) => {
    const element = document.getElementById(type) as HTMLInputElement;
    if (element.value === "") {
      (document.getElementById("wei") as HTMLInputElement).value = "";
      (document.getElementById("gwei") as HTMLInputElement).value = "";
      (document.getElementById("eth") as HTMLInputElement).value = "";
      (document.getElementById("fiat") as HTMLInputElement).value = "";
      return;
    }
    const number = Number(element.value);

    switch (type) {
      case "wei":
        var data = convert(number, "wei");
        /// set all inputs

        break;
      case "gwei":
        console.log("gwei");
        var data = convert(number, "gwei");
        break;
      case "eth":
        var data = convert(number, "ether");
        break;
      case "fiat":
        var data = convert(number, "ether");
        break;
      default:
        var data = undefined;
        break;
    }
    console.log(data);
    if (data === undefined) {
      (document.getElementById("wei") as HTMLInputElement).value = "";
      (document.getElementById("gwei") as HTMLInputElement).value = "";
      (document.getElementById("eth") as HTMLInputElement).value = "";
      (document.getElementById("fiat") as HTMLInputElement).value = "";
      return;
    }
    (document.getElementById("wei") as HTMLInputElement).value =
      data.wei.toString();
    (document.getElementById("gwei") as HTMLInputElement).value =
      data.gwei.toString();
    (document.getElementById("eth") as HTMLInputElement).value =
      data.ether.toString();
    (document.getElementById("fiat") as HTMLInputElement).value = (
      data.ether * currency_ETH
    ).toString();
  };

  const selectCurrency = () => {
    const selectID = document.getElementById("getPrice") as HTMLSelectElement;
    const selectedValue = selectID.value;

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
  };

  const convertUnixTime = (unixTime: number) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userTime = new Date(unixTime * 1000).toLocaleString("en-US", {
      timeZone: userTimeZone,
    });
    return userTime;
  };

  return (
    <div>
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
        <div className={styles.container}>
          <p>
            {`last update: ${convertUnixTime(
              timeRefresh
            )} -- ETH price: ${nameCurrency} ${currency_ETH}`}
          </p>
          <div>
            <select name="" id="getPrice" onChange={selectCurrency}>
              <option value="getUSD" selected>
                USD Price
              </option>
              <option value="getEUR">EUR Price</option>
              <option value="getARB">ARB Price</option>
              <option value="getMXN">MXN Price</option>
              <option value="getARG">ARG Price</option>
              <option value="getVEF">VEF Price</option>
              <option value="getPEN">PEN Price</option>
              <option value="getCLP">CLP Price</option>
            </select>
          </div>
          <div className={styles.data}>
            <p>Wei&nbsp;&nbsp;</p>{" "}
            <input
              type="text"
              inputMode="numeric"
              id="wei"
              onChange={() => listenInput("wei")}
            />
          </div>

          <div className={styles.data}>
            <p>GWei&nbsp;</p>{" "}
            <input
              type="text"
              inputMode="numeric"
              id="gwei"
              onChange={() => listenInput("gwei")}
            />
          </div>

          <div className={styles.data}>
            <p>ETH&nbsp;&nbsp;</p>{" "}
            <input
              type="text"
              inputMode="numeric"
              id="eth"
              onChange={() => listenInput("eth")}
            />
          </div>

          <div className={styles.data}>
            <p>{nameCurrency}&nbsp;&nbsp;</p>{" "}
            <input
              type="text"
              inputMode="numeric"
              id="fiat"
              onChange={() => listenInput("fiat")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
