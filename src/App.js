import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './data';

export default function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState('');

  const toWei = (n) => {
    return web3.utils.toWei(n, 'ether');
  };

  const fromWei = (n) => {
    return web3.utils.fromWei(n, 'ether');
  };

  useEffect(() => {
    const loadBlockchain = async () => {
      try {
        if (window.ethereum) {
          console.log(window.ethereum);

          // Loading web3
          const web3Local = new Web3(
            window.ethereum || 'http://localhost:7545'
          );
          console.log('web3Local', web3Local);
          setWeb3(web3Local);

          // await window.ethereum.enable();
          let accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          console.log('accounts ', accounts);
          setAccount(accounts[0]);

          const dai = new web3Local.eth.Contract(
            CONTRACT_ABI,
            CONTRACT_ADDRESS
          );
          console.log('dai ', dai);
          setContract(dai);

          const bal = await dai.methods.balanceOf(accounts[0]).call();
          console.log('bal ', bal);
          setBalance(bal.toString());
        } else if (Web3.givenProvider) {
          // creating web3 instance
          const web3local = new Web3(Web3.givenProvider);
          console.log('web3local: ', web3local);
          setWeb3(web3local);

          // popup metamask to connect account
          await web3local.givenProvider.enable();

          // getting the account connected
          const accountsLocal = await web3local.eth.getAccounts();
          console.log('accountsLocal: ', accountsLocal[0]);
          setAccount(accountsLocal[0]);
        } else {
          console.log('please install metamask');
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadBlockchain();
  }, []);

  if (!web3) return <h1>please connect to metamask</h1>;

  return (
    <div>
      <h1>{fromWei(balance)}</h1>
      <button
        style={{ fontSize: '30px' }}
        onClick={async () => {
          console.log('contract.methods ', contract.methods);
          console.log(toWei('2'));
          await contract.methods
            .transfer('0x103909BBbA33A30DB28a3572EdA16e130Fe2BeC9', toWei('10'))
            .send({ from: account });
        }}
      >
        send tokens
      </button>
    </div>
  );
}
