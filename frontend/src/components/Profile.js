import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState, useEffect } from "react";
import NFTTile from "./NFTTile";

export default function Profile() {
  const [data, updateData] = useState([]);
  const [address, updateAddress] = useState("0x");
  const [totalPrice, updateTotalPrice] = useState("0");

  const fetchNFTData = async () => {
    const ethers = require("ethers");
    let sumPrice = 0;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr); // Update address state

    const items = await Promise.all(
      transaction.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        sumPrice += Number(price);
        return item;
      })
    );

    updateData(items);
    updateTotalPrice(sumPrice.toPrecision(3));
  };

  // Fetch data on component mount and when address changes
  useEffect(() => {
    fetchNFTData();
  }, [address]);

  // Listen for account changes
  useEffect(() => {
    const ethereum = window.ethereum;
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        console.log("Please connect to MetaMask.");
      } else {
        console.log("Accounts changed. Connected to:", accounts[0]);
        fetchNFTData();
      }
    };

    if (ethereum) {
      ethereum.on("accountsChanged", handleAccountsChanged);
      return () =>
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
    }
  }, []);

  return (
    <div className="profileClass" style={{ "min-height": "100vh" }}>
      <Navbar />
      
    </div>
  );
}