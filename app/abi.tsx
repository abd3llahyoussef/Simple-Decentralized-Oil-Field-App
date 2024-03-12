export const abi = [
  { inputs: [], name: "OilField__NotAdmin", type: "error" },
  { inputs: [], name: "OilField__NotOwner", type: "error" },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "data", type: "string" },
    ],
    name: "appData",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "addPerson",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "data", type: "string" }],
    name: "storeAppData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "data", type: "string" }],
    name: "storeIoTData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "users",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];
export const contractAddress = "0xDC3cEeFEFCB9B2c2717590266a185aEB4d2e6Fd0";
