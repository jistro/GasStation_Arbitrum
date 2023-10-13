'use client';
import Image from 'next/image'
import styles from './page.module.css'
import React, { useState, useEffect } from 'react'
import exp from 'constants';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY_ARB;


export default function Home() {
  var timeRefresh = Math.floor(Date.now() / 1000);;
  const [usd_eth, setUsd_eth] = useState(0);
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

      const [response1, response2, response3, response4] = await Promise.all([
        fetch(
          `https://api-goerli.arbiscan.io/api?module=proxy&action=eth_estimateGas&data=0x&to=0x007aB5199B6c57F7aA51bc3D0604a43505501a0C&value=0x1&gasPrice=${gasPriceValue}&apikey=${API_KEY}`
        ),
        fetch(
          `https://api-goerli.arbiscan.io/api?module=proxy&action=eth_estimateGas&data=0xa9059cbb00000000000000000000000005f11b22d790fe64f7984fa4e5926c8f37216f1000000000000000000000000000000000000000000000003635c9adc5dea00000&to=0x007aB5199B6c57F7aA51bc3D0604a43505501a0C&gasPrice=${gasPriceValue}&apikey=${API_KEY}`
        ),
        fetch(
          `https://api-goerli.arbiscan.io/api?module=proxy&action=eth_estimateGas&data=0xa9059cbb000000000000000000000000f89d7b9c864f589bbf53a82105107622b35eaa4000000000000000000000000000000000000000000000000000000000000F4240&to=0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9&gasPrice=${gasPriceValue}&apikey=${API_KEY}`
        ),
        fetch(
          `https://api-goerli.arbiscan.io/api?module=proxy&action=eth_estimateGas&data=0x42842e0e000000000000000000000000837cb1cf798d2a8cbb898a86e1bb5ee0978233ab00000000000000000000000085e9c743172f1d7ed4652fdf27f571453caf3ceb00000000000000000000000000000000000000000000000000000000000009ce&to=0x85E9c743172F1d7ed4652fdf27f571453CAf3CeB&gasPrice=${gasPriceValue}&apikey=${API_KEY}`
        ),
      ]);

      const [result1, result2, result3, result4] = await Promise.all([
        response1.json(),
        response2.json(),
        response3.json(),
        response4.json(),
      ]);

      setGasPrice(gasPriceValue);
      setTxEstimateGas([
        parseInt(result1.result, 16),
        parseInt(result2.result, 16),
        parseInt(result3.result, 16),
        parseInt(result4.result, 16),
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getConvertionRate_USD_ETH = async () => {
    console.log("getConvertionRate_USD_ETH");
    try {
      const response = await fetch(
        `https://api.coinbase.com/v2/exchange-rates?currency=ETH`
      );
      const data = await response.json();
      const convertionRate_USD_ETH = data.data.rates.USD;
      setUsd_eth(convertionRate_USD_ETH);
      console.log(usd_eth);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    getGasPrice();
    getConvertionRate_USD_ETH();
    timeRefresh = Math.floor(Date.now() / 1000);
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

  const convertGweiToEth = (gwei: number) => {
    const eth = gwei / 1000000000;
    return eth;
  }

  const convertETHtoUSD = (eth: number) => {
    const usd = eth * usd_eth;
    return usd.toFixed(4);
  }

  const convertUnixTime = (unixTime: number) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userTime = new Date(unixTime * 1000).toLocaleString('en-US', { timeZone: userTimeZone });
    return userTime;
  }


  return (
    <>
      <main className={styles.main}>
        <footer>
          <Image
            src="/LOGO.png"
            alt="ethereum"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '20%', height: 'auto' }} // optional
          />
        </footer>
        {loading ?
          (
            <div className={styles.loading}>
              <div className={styles.lds_hourglass} />
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
              <p
                style={{
                  fontSize: '10px',
                  color: 'gray',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                }}
              >
                {`last update: ${convertUnixTime(timeRefresh)} -- ETH price: USD ${usd_eth}`}
              </p>
              <br />
              <h1> Gas estimate </h1>
              <table className={styles.material_table}>
                <thead
                  style={{
                    borderRadius: '10px',
                  }}
                >
                  <tr>
                    <th className={styles.material_table__nameTransaction}>
                      Name of transaction</th>
                    <th className={styles.material_table__gasPrice}>
                      Gas
                    </th>
                    <th>
                      Eth cost
                    </th>
                    <th className={styles.material_table__USDCost}>
                      USD cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Eth transfer</td>
                    <td>{txEstimateGas[0]}</td>
                    <td>{`Ξ ${convertGweiToEth(txEstimateGas[0])}`}</td>
                    <td>{`$ ${convertETHtoUSD(convertGweiToEth(txEstimateGas[0]))}`}</td>
                  </tr>
                  <tr>
                    <td>ARB transfer</td>
                    <td>{txEstimateGas[1]}</td>
                    <td>{`Ξ ${convertGweiToEth(txEstimateGas[1])}`}</td>
                    <td>{`$ ${convertETHtoUSD(convertGweiToEth(txEstimateGas[1]))}`}</td>
                  </tr>
                  <tr>
                    <td>USDT transfer</td>
                    <td>{txEstimateGas[2]}</td>
                    <td>{`Ξ ${convertGweiToEth(txEstimateGas[2])}`}</td>
                    <td>{`$ ${convertETHtoUSD(convertGweiToEth(txEstimateGas[2]))}`}</td>
                  </tr>
                  <tr>
                    <td>NTF transfer</td>
                    <td>{txEstimateGas[3]}</td>
                    <td>{`Ξ ${convertGweiToEth(txEstimateGas[3])}`}</td>
                    <td>{`$ ${convertETHtoUSD(convertGweiToEth(txEstimateGas[3]))}`}</td>
                  </tr>
                  <tr>
                    <td className={styles.material_table__rawLeft}>Custom gas</td>
                    <td><input type="number" id="customGas" name="customGas" onChange={getCustomGasPrice} /></td>
                    <td>{`Ξ ${customGasPrice}`}</td>
                    <td className={styles.material_table__rawRight}>{`$ ${convertETHtoUSD(customGasPrice)}`}</td>
                  </tr>
                </tbody>
              </table>

            </>
          )

        }

      </main>
      <header className={styles.header}>
        <p
          style={{
            textAlign: 'center',
            fontFamily: 'monospace',
          }}
        >
          Made with ❤️ by <a href="https://twitter.com/jistro" style={{ color: 'white', textDecoration: 'none', }}>@jistro</a> for the arbitrum community
        </p>
        <br />
        <p
          style={{
            fontSize: '10px',
            color: 'gray',
            textAlign: 'center',
            fontFamily: 'monospace',
            paddingTop: '10px',
          }}
        >
          Disclaimer: All the information is provided by <a href="https://arbiscan.io" style={{ color: 'gray', textDecoration: 'none', }}>arbiscan.io</a> block explorer, and <a href="https://coinbase.com" style={{ color: 'gray', textDecoration: 'none', }}>coinbase.com</a> exchange rate. The developer is not responsible for any loss or damage caused by the use of this information. All gas estimates are calculated using the current gas price and might not be accurate.
        </p>
      </header>
    </>
  )
}

