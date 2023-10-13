'use client';
import Image from 'next/image'
import styles from './page.module.css'
import React, { useState, useEffect } from 'react'
import exp from 'constants';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY_ARB;


export default function Home() {
  const [gasPrice, setGasPrice] = useState(0);
  const [txEstimateGas, setTxEstimateGas] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [customGasPrice, setCustomGasPrice] = useState(0);


  const getGasPrice = async () => {
    try {
      const gasPriceResponse = await fetch(
        `https://api.arbiscan.io/api?module=proxy&action=eth_gasPrice&apikey=${API_KEY}`
      );
      const gasPriceData = await gasPriceResponse.json();
      const gasPriceValue = gasPriceData.result;

      const [response1, response2, response3] = await Promise.all([
        fetch(
          `https://api-goerli.arbiscan.io/api?module=proxy&action=eth_estimateGas&data=0x&to=0x007aB5199B6c57F7aA51bc3D0604a43505501a0C&value=0x1&gasPrice=${gasPriceValue}&apikey=${API_KEY}`
        ),
        fetch(
          `https://api-goerli.arbiscan.io/api?module=proxy&action=eth_estimateGas&data=0xa9059cbb00000000000000000000000005f11b22d790fe64f7984fa4e5926c8f37216f1000000000000000000000000000000000000000000000003635c9adc5dea00000&to=0x007aB5199B6c57F7aA51bc3D0604a43505501a0C&gasPrice=${gasPriceValue}&apikey=${API_KEY}`
        ),
        fetch(
          `https://api-goerli.arbiscan.io/api?module=proxy&action=eth_estimateGas&data=0xa9059cbb000000000000000000000000f89d7b9c864f589bbf53a82105107622b35eaa4000000000000000000000000000000000000000000000000000000000000F4240&to=0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9&gasPrice=${gasPriceValue}&apikey=${API_KEY}`
        ),
      ]);

      const [result1, result2, result3] = await Promise.all([
        response1.json(),
        response2.json(),
        response3.json(),
      ]);

      setGasPrice(gasPriceValue);
      setTxEstimateGas([
        parseInt(result1.result, 16),
        parseInt(result2.result, 16),
        parseInt(result3.result, 16),
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getGasPrice();
  }, []);

  const getCustomGasPrice = () => {
    const inputID = document.getElementById("customGas") as HTMLInputElement;
    /// volvemos a inputID un numero
    if (inputID.value !== "") {
    const gasPriceValue = (parseInt(inputID.value) * gasPrice) / 1000000000000000000;
    console.log(gasPriceValue);
    setCustomGasPrice(gasPriceValue);
    } else {
      setCustomGasPrice(0);
    }
  }


  return (
    <main className={styles.main}>
      <footer>
        <h1>Gas hub</h1>
      </footer>
      {loading ?
        (
          <div className={styles.loading}>
          <div className={styles.lds_hourglass}/>
          <div>loading</div>
          </div>
        ) : (
          <>
            <br />
            <div className={styles.twoTables}>
              <div className={styles.tableOne}>{gasPrice / 1000000000} gwei for slow transaction</div>
              
              <div className={styles.tableTwo}>{(gasPrice / 1000000000) * 2} gwei for medium transaction</div>
            </div>
            <br />
            <p>
              last update: {new Date().toLocaleString()}
            </p>
            <br />
            <h1> Gas estimate </h1>
            <table className={styles.material_table}>
              <thead>
                <tr>
                  <th>Name of transaction</th>
                  <th>Gas</th>
                  <th>Eth cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Eth transfer</td>
                  <td>{txEstimateGas[0]}</td>
                  <td>{`Ξ ${(txEstimateGas[0] * gasPrice) / 1000000000000000000}`}</td>
                </tr>
                <tr>
                  <td>ARB transfer</td>
                  <td>{txEstimateGas[1]}</td>
                  <td>{`Ξ ${(txEstimateGas[1] * gasPrice) / 1000000000000000000}`}</td>
                </tr>
                <tr>
                  <td>USDT transfer</td>
                  <td>{txEstimateGas[2]}</td>
                  <td>{`Ξ ${(txEstimateGas[2] * gasPrice) / 1000000000000000000}`}</td>
                </tr>

                <tr>
                  <td>Custom gas</td>
                  <td><input type="number" id="customGas" name="customGas" onChange={getCustomGasPrice}
                  /></td>
                  <td>{`Ξ ${customGasPrice}`}</td>
                </tr>
              </tbody>
            </table>

          </>
        )

      }
    </main>
  )
}

