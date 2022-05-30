import { MainContext } from '../context'
import { useState, useRef } from 'react'
import { providers, utils } from 'ethers'
import { WebBundlr } from '@bundlr-network/client'

function MyApp({ Component, pageProps }) {
  const [bundlrInst, setBundlrInst] = useState();
  const [balance, setBalance] = useState();
  const bundlrRef = useRef();

  const initialize = async () => {
    try {
      await window.ethereum.enable();
      const provider = new providers.Web3Provider(window.ethereum);
      await provider._ready();

      const bundlr = new WebBundlr('https://node1.bundlr.network', 'matic', provider)
      await bundlr.ready();

      setBundlrInst(bundlr);
      bundlrRef.current = bundlr;
    }
    catch (error) {
      console.log('Must have metamask: ', error);
    }
    getBalance();
  }

  const getBalance = async () => {
    try {
      const bal = await bundlrRef.current.getLoadedBalance();
      setBalance(utils.formatEther(bal.toString()));
    } catch (error) {
      console.log('error getting balance: ', error);
    }
  }

  return (
    <div style={containerStyle}>
      <MainContext.Provider value={{
        initialize,
        getBalance,
        balance,
        bundlrInst
      }}>
        <h1>Arweave/Bundlr</h1>
        <Component {...pageProps} />
      </MainContext.Provider>
    </div>
  )
}
const containerStyle = {
  width: '80vw',
  margin: '40px auto',
  textAlign: 'center',
}
export default MyApp