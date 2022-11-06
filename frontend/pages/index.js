import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import ABI from "/abi";
export default function Home() {
  const [enteredText, setEnteredText] = useState("");
  const [myContract, setMyContract] = useState("");
  const [fetchedText, setFetchedText] = useState("");

  const connectWithMetaMask = async () => {
    if (window.ethereum) {
      // A Web3Provider wraps a standard Web3 provider, which is
      // what MetaMask injects as window.ethereum into each page
      let provider = new ethers.providers.Web3Provider(window.ethereum);

      // to check with which network metamask is currently connected, and show required alert
      const { chainId } = await provider.getNetwork();
      console.log(chainId);

      // MetaMask requires requesting permission to connect users accounts
      await provider.send("eth_requestAccounts", []);
      
      // The MetaMask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
      let signer = provider.getSigner();
      console.log("connected with metamask");

      // creating an instance of the smart contract
      // it takes three parameters => {contract's address, abi, signer/provider}
      // provider can perform read only transactions
      // signer can perform all kind of transactions
      let contract = new ethers.Contract(
        "0xF388a9ADE1de17a8fF25Ed1E6b5bA45492267b7D",
        ABI,
        signer
      );
      setMyContract(contract);
      console.log(contract.address);

    } else {
      alert(`please install metamask !!`);
    }
  };

  const getText = async () => {
    console.log("clicked on get button");
    myContract
      .get()
      .then((val) => setFetchedText(val))
      .catch((err) =>
        console.log("Printing error msg at getText function: ", err.message)
      );
  };

  const setText = async () => {
    console.log(`you clicked the set-text button.`);
    console.log(`Entered text right now is: ${enteredText}`);
    console.log(myContract);
    myContract
      .setGreeting(enteredText)
      .then((tx) => {
        console.log("transaction occured : ", tx.hash);
        return tx
          .wait()
          .then(() => {
            console.log("text overwritten successfully");
          })
          .catch((err) =>
            console.log(
              "Printing error msg in overwritting text -1: ",
              err.message
            )
          );
      })
      .catch((err) => {
        console.log("Printing error msg in transaction hash -2: ", err.message);
      });
  };

  const onTextChange = (e) => {
    setEnteredText(e.target.value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>DAPP_01</title>
        <meta
          name="description"
          content="This is first full stack developed by Deependu Jha."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button
        className="btn my-4 btn-success"
        onClick={async () => {
          connectWithMetaMask();
        }}
      >
        Connect with Metamask
      </button>
      <div>
        <button
          className="btn btn-primary my-4"
          onClick={async () => {
            getText();
          }}
        >
          Get Text
        </button>
        <span className="mx-3" id="text">
          {fetchedText}
        </span>
      </div>
      <div>
        <button
          className="btn btn-primary my-4"
          onClick={async () => {
            setText();
          }}
        >
          Set Text
        </button>
        <input className="mx-3" type="text" onChange={onTextChange}></input>
      </div>
    </div>
  );
}
