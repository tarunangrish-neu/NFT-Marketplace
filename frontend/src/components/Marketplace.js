import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState, useEffect } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function Marketplace() {
  const [data, setData] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    async function checkWalletConnected() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setWalletConnected(accounts.length > 0);
      }
    }

    // Initial check to see if wallet is connected
    checkWalletConnected();

    // Reload NFTs whenever the wallet connection status changes
    if (walletConnected) {
      getAllNFTs();
    }

    // Set up an event listener for when the account changes
    window.ethereum?.on("accountsChanged", (accounts) => {
      setWalletConnected(accounts.length > 0);
    });
  }, [walletConnected]);

  async function getAllNFTs() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );

    try {
      const transaction = await contract.getAllNFTs();
      const items = await Promise.all(
        transaction.map(async (i) => {
          const tokenURI = GetIpfsUrlFromPinata(
            await contract.tokenURI(i.tokenId)
          );
          const meta = await axios.get(tokenURI).then((res) => res.data);

          return {
            price: ethers.utils.formatUnits(i.price.toString(), "ether"),
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
          };
        })
      );
      setData(items);
    } catch (error) {
      console.error("Failed to get NFTs:", error);
    }
  }

  return (
    <div>
      <Navbar setWalletConnected={setWalletConnected} />
      <div className="flex flex-col place-items-center mt-20">
        <div className="md:text-4xl mt-20 font-bold text-white">Top NFTs</div>
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => (
            <NFTTile data={value} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
