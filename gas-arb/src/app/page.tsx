'use client';
import Image from 'next/image'
import styles from './page.module.css'
import React, { useState, useEffect } from 'react'
import exp from 'constants';
import Head from 'next/head';


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

      const [response1, response2, response3, response4, response5] = await Promise.all([
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
        fetch(
          `https://api-goerli.arbiscan.io/api?module=proxy&action=eth_estimateGas&data=0x414bf38900000000000000000000000082af49447d8a07e3bd95bd0d56f35241523fbab1000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc80000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000005e31450f86bc16c2756dd36dc7b188ad728b391b00000000000000000000000000000000000000000000000000000000652da4e2000000000000000000000000000000000000000000000000000eef7743c380a1000000000000000000000000000000000000000000000000000000000064c8a10000000000000000000000000000000000000000000000000000000000000000&to=0xe592427a0aece92de3edee1f18e0157c05861564&gasPrice=${gasPriceValue}&apikey=${API_KEY}`
        ),
      ]);

      const [result1, result2, result3, result4, result5] = await Promise.all([
        response1.json(),
        response2.json(),
        response3.json(),
        response4.json(),
        response5.json(),
      ]);

      setGasPrice(gasPriceValue);
      setTxEstimateGas([
        parseInt(result1.result, 16),
        parseInt(result2.result, 16),
        parseInt(result3.result, 16),
        parseInt(result4.result, 16),
        parseInt(result5.result, 16),
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
      <Head>
        <title>Gas hub</title>
        <meta
          charSet="utf-8"
          name="Gas hub for Arbitrum"
          content="Gas hub is a tool for Arbitrum users to find the gas prices and gas fees for their transactions."
        />
      </Head>
      <main className={styles.main}>
        <footer>
          <Image
            src="/LOGO.png"
            alt="ethereum"
            width={0}
            height={0}
            sizes="100vw"
            style={
              { width: '25%', height: 'auto' }

            } // optional
          />
        </footer>
        {loading ?
          (
            <div className={styles.loading}>
              <div className={styles.lds_hourglass} />
              <div
                style={{
                  fontSize: '15px',
                  textAlign: 'center',
                  fontFamily: 'monospace',
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
                  {gasPrice / 1000000000} gwei for transaction
                </div>
              </div>
              <br />
              <p
                style={{
                  fontSize: '10px',
                  color: '#bababa',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                }}
              >
                {`last update: ${convertUnixTime(timeRefresh)} -- ETH price: USD ${usd_eth}`}
              </p>
              <br />
              <h1> Gas estimate </h1>
              <br />
              <div className={styles.gasTXInfo}>
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
                      <td>NFT transfer</td>
                      <td>{txEstimateGas[3]}</td>
                      <td>{`Ξ ${convertGweiToEth(txEstimateGas[3])}`}</td>
                      <td>{`$ ${convertETHtoUSD(convertGweiToEth(txEstimateGas[3]))}`}</td>
                    </tr>
                    <tr>
                      <td>Swap</td>
                      <td>{txEstimateGas[4]}</td>
                      <td>{`Ξ ${convertGweiToEth(txEstimateGas[4])}`}</td>
                      <td>{`$ ${convertETHtoUSD(convertGweiToEth(txEstimateGas[4]))}`}</td>
                    </tr>
                    <tr>
                      <td className={styles.material_table__rawLeft}>Custom gas</td>
                      <td><input type="number" id="customGas" name="customGas" onChange={getCustomGasPrice} /></td>
                      <td>{`Ξ ${customGasPrice}`}</td>
                      <td className={styles.material_table__rawRight}>{`$ ${convertETHtoUSD(customGasPrice)}`}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        <div style={{ paddingBottom: '50px' }} />
        <div style={{ textAlign: 'left', color: '#EDEDED', fontFamily: 'monospace' }}>
          <h1 style={{ paddingBottom: '20px' }}>What is gas?</h1>
          <p>
            Gas is like fuel for the network, powering its operations. Every action requires computational effort measured in units called &quot;gwei.&quot; These units, denominated in ether (ETH), are paid as gas fees.
          </p>
          <br />
          <h1 style={{ paddingBottom: '20px' }}>Gas Fees in Arbitrum</h1>
          <p>
            In the context of Arbitrum, there are two parties that users pay when submitting a transaction:
          </p>
          <br />
          <p>
            The &quot;poster,&quot; if reimbursable, for L1 resources like L1 calldata required to post the transaction.
          </p>
          <br />
          <p>
            The network fee account for L2 resources, which includes computation, storage, and other burdens borne by L2 nodes to process the transaction.
          </p>
          <br />
          <p>
            The L1 component of the fee is determined by the transaction&apos;s estimated contribution to its batch&apos;s size and the L2&apos;s view of the L1 data price, which adjusts dynamically to ensure fair compensation for batch posters. The L2 component includes traditional fees, like computation and storage charges, as well as additional fees for executing L2-specific precompiles, which are priced based on the resources used during execution.
          </p>
          <br />
          <p>
            Arbitrum establishes a minimum gas price floor, which is currently set at 0.1 gwei on Arbitrum One and 0.01 gwei on Nova.
          </p>
          <br />
          <p
            style={{
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}
          >
            In Arbitrum, transaction tips are not considered, as the sequencer prioritizes transactions on a first-come, first-served basis. Users pay the base fee, regardless of the tip they may choose.
          </p>
          <br />
          <p> For more information, please visit the official documentation: </p>
          <p> <a href="https://docs.arbitrum.io/arbos/gas" className={styles.link}>Arbitrum documentation -- Gas and Fees </a></p>
          <p> <a href="https://ethereum.org/en/developers/docs/gas/" className={styles.link}>Ethereum documentation -- Gas and Fees </a></p>
        </div>
        <div style={{ paddingBottom: '50px' }} />
      </main>
      <header className={styles.header}>
        <p
          style={{
            textAlign: 'center',
            fontFamily: 'monospace',
          }}
        >
          Made with ❤️ by <a href="https://twitter.com/jistro" style={{ color: 'white', textDecoration: 'none', }}>@jistro</a> for the arbitrum community (💙,🧡)
        </p>
        <br />
        <p
          style={{
            fontSize: '10px',
            color: 'gray',
            textAlign: 'center',
            fontFamily: 'monospace',
            paddingTop: '5px',
          }}
        >
          Disclaimer: This information is sourced from <a href="https://arbiscan.io" style={{ color: 'gray', textDecoration: 'none', }}>arbiscan.io</a> block explorer data and <a href="https://coinbase.com" style={{ color: 'gray', textDecoration: 'none', }}>coinbase.com</a> exchange rates API.

          The developer assumes no liability for any losses or damages resulting from the use of this information. Please note that all gas estimates are based on the current gas price and may not be entirely precise.
        </p>
      </header>
    </>
  )
}

