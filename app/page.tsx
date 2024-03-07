"use client";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";
import { abi, contractAddress } from "./abi";
import { useState, useEffect } from "react";
import dotenv from "dotenv";
import { Alchemy, Network, AlchemySubscription, Utils } from "alchemy-sdk";
import { toast, ToastContainer } from "react-toastify";
import { Contract } from "web3-eth-contract";
import "react-toastify/dist/ReactToastify.css";
import { Web3 } from "web3";

dotenv.config();

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
export default function Home() {
  const [open, setOpen] = useState("0");
  const webSocketProvider = process.env.WEBSOCKET_PROVIDER!;

  function getIotData() {
    const web3 = new Web3(
      new Web3.providers.WebsocketProvider(webSocketProvider)
    );
    const myContract = new web3.eth.Contract(abi, contractAddress);
    myContract.events.appData({}).on("data", (event) => console.log(event));
  }

  const handlePump = async () => {
    open === "0" ? setOpen("1") : setOpen("0");
    try {
      await getData();

      if (open === "0") {
        //alert("Turn Pump Off Successfully!");
        toast.success("Turn Pump Off Successfully!", {
          position: "top-center",
        });
      } else {
        toast.success("Turn Pump On Successfully!", {
          position: "top-right",
        });
      }
      await getIotData();
    } catch (err) {
      toast.error("Error while Running Pump!", {
        position: "top-right",
      });
    }
  };
  // connect to MetaMask Account
  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      const connectBtn: any = document.getElementById("connect button");
      try {
        const connect = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        connectBtn.innerHTML = "Connected!!!";
        const account = await window.ethereum.request({
          method: "eth_accounts",
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
  //use Contract Event

  //Make A Fund to send Amount of ETH
  async function getData() {
    if (typeof window.ethereum != "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transaction = await contract.storeAppData(open);
        await Listen(transaction, provider);
      } catch (error) {
        console.log(error);
      }
    }
  }

  //Make An Event
  function Listen(transaction: any, provider: any) {
    console.log(`Mining ${transaction.hash}`);
    provider.once(transaction.hash, (TransactionReceipt: any) => {
      console.log(
        `transactions combleted with ${TransactionReceipt.confirmations} confirmations.`
      );
    });
  }
  return (
    <div className="grid grid-cols-1 h-screen place-items-center bg-white">
      <button
        id="connect button"
        onClick={connect}
        className="h-14 w-32 mt-2 px-2 font-semibold rounded-3xl border-2 text-slate-900"
      >
        connect
      </button>
      <button
        id="Data button"
        onClick={handlePump}
        className="h-14 w-24 mt-2 px-2 font-semibold rounded-3xl border-2 text-slate-900"
      >
        pump
      </button>
      <ToastContainer />
    </div>
  );
}
