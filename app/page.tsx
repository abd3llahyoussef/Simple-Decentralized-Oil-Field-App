"use client";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";
import { abi, contractAddress } from "./abi";
import { useEffect, useState } from "react";
import dotenv from "dotenv";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Web3 } from "web3";
import Image from "next/image";
import gasPump from "../public/gasPump.svg";
import temp from "../public/temp.svg";
dotenv.config();

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
export default function Home() {
  const [open, setOpen] = useState("1");
  const [account, setAccount] = useState<string | null>(null);
<<<<<<< HEAD
  const [temperature, setTemperature] = useState("0");
  const webSocketKey = process.env.WEBSOCKET_PROVIDER!;
=======
  const [temperature, setTemperature] = useState(0);
  
>>>>>>> a590b35b2bf74d209d3cb8bdb4cc4558893fe1b8

  const web3 = new Web3(
    new Web3.providers.WebsocketProvider(
      
    )
  );
  const myContract = new web3.eth.Contract(abi, contractAddress);
  myContract.events.appData({}).on("data", (event) => {
    console.log(web3.utils.hexToAscii(event.data));
    setTemperature(web3.utils.hexToUtf8(event.data).replace(/\D/g, ""));
  });

  useEffect(() => {}, [open, temperature]);
  const handlePump = async () => {
    const pumbBtn: any = document.getElementById("Data button");

    (await open) === "1" ? setOpen("0") : setOpen("1");

    try {
      await getData();

      if (open === "0") {
        pumbBtn.style.backgroundColor = "#808080";
        toast.success("Turn Pump Off Successfully!", {
          position: "top-center",
        });
      } else {
        pumbBtn.style.backgroundColor = "#3ef83e";
        toast.success("Turn Pump On Successfully!", {
          position: "top-right",
        });
      }
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

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const publicAddress = await signer.getAddress();
        await setAccount(publicAddress);
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
    <div className=" bg-black m-5">
      <nav className="grid grid-cols-2">
        <h1 className="ml-10 font-semibold text-3xl">Oil Field System</h1>
        <button
          id="connect button"
          onClick={connect}
          className="mr-10 mt-2 px-2 font-semibold rounded-3xl border-2 text-white bg-gray-600 "
        >
          {account ? (
            <div className="ml-auto py-2 px-4">
              Connected to {account.slice(0, 6)}...
              {account.slice(account.length - 4)}
            </div>
          ) : (
            <div> Connect</div>
          )}
        </button>
      </nav>
      <div className="grid grid-cols-1 h-screen place-items-center">
        <div
          id="temp button"
          className="p-5 font-semibold rounded-full border-2 grid grid-cols-1 h-fit place-items-center text-white bg-gray-600  w-auto"
        >
          <Image src={temp} alt="temprature of oil" width="60" height="90" />
          <p className="text-3xl mt-2">{temperature}</p>
        </div>
        <div className="grid grid-cols-1 h-fit place-items-center">
          <button
            id="Data button"
            onClick={handlePump}
            className=" w-auto px-2 flex items-center justify-center  font-semibold rounded-full border-2 text-white bg-gray-600 "
          >
            <Image src={gasPump} alt="gasPump" width="60" height="90" />
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
