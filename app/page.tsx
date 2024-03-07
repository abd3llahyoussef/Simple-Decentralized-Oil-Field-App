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
  const settings = {
    apiKey: "u8_uLJJIlQkZqdD_S69kowsov-pFQ_V4",
    network: Network.ETH_SEPOLIA,
  };
  const alchemy = new Alchemy(settings);
  const nonce = new Utils.Interface(abi);
  const nonce_abi = nonce.encodeFilterTopics("appData", []);

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
  async function getIt() {
    if (typeof window.ethereum != "undefined") {
      // const provider = new ethers.WebSocketProvider(webSocketProvider);
      // const signer = await provider.getSigner();
      // const contract = new ethers.Contract(contractAddress, abi, provider);

      try {
        // await contract.on("appData", (from, to, _amount, event) => {
        //   let info = {
        //     from: from,
        //     to: to,
        //     value: _amount,
        //     data: event,
        //   };
        //   console.log(JSON.stringify(info, null, 4));
        //   console.log(event.log);
        //   console.log(`${from} => ${to} : ${_amount}`);
        // });
        alchemy.ws.on("appData", (blockNumber) => {
          console.log("alchemy data :", blockNumber);
        });
        const logs: any = await alchemy.core.getLogs({
          fromBlock: "0x0",
          toBlock: "latest",
          address: contractAddress,
          topics: nonce_abi,
        });
        console.log("pending transactions", logs);
        // console.log("data", logs[36].data);
        // const filter = await contract.filters.appData();
        // contract.on(filter, (from, to, amount, event) => {
        //   console.log(
        //     `Transaction done! From: ${from}, To: ${to}, Amount:${event}`
        //   );
        // });
      } catch (error) {
        console.log(error);
      }
    }
  }
  // useEffect(() => {
  //   getIt();
  // }, []);

  //decrypt Hash Data

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
