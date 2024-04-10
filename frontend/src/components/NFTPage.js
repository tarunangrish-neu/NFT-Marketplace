import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import myERC20Token from "../myERC20Token.json";
import nftMarketplaceERC20Payment from "../nftMarketplaceERC20Payment.json";
import axios from "axios";
import { useState, useEffect } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function NFTPage() {
  const [data, setData] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [currAddress, setCurrAddress] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ETH");
  const { tokenId } = useParams(); // Get tokenId from URL parameters

  useEffect(() => {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const fetchData = async () => {
      try {
        const addr = await signer.getAddress();
        setCurrAddress(addr);

        let contract = new ethers.Contract(
          MarketplaceJSON.address,
          MarketplaceJSON.abi,
          signer
        );
        const tokenURI = await contract.tokenURI(tokenId);
        const listedToken = await contract.getListedTokenForId(tokenId);
        const formattedTokenUri = GetIpfsUrlFromPinata(tokenURI);
        const response = await axios.get(formattedTokenUri);
        const meta = response.data;

        setIsOwner(listedToken.owner.toLowerCase() === addr.toLowerCase());
        const newItem = {
          ...meta,
          price: ethers.utils.formatUnits(
            listedToken.price.toString(),
            "ether"
          ),
          tokenId,
          seller: listedToken.seller,
          owner: listedToken.owner,
          isOwner,
        };
        setData(newItem);
      } catch (error) {
        console.error("Failed to fetch NFT data:", error);
      }
    };

    fetchData();

    const handleAccountsChanged = (accounts) => {
      if (accounts[0]) {
        fetchData();
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [isOwner, tokenId]); // Effect runs on tokenId change

  const buyNFT = async (tokenId) => {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );
    const salePrice = ethers.utils.parseUnits(data.price, "ether");
    setMessage("Buying the NFT... Please Wait (Upto 5 mins)");

    try {
      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait(); // Wait for the transaction to be confirmed
      setMessage("");
      alert("You successfully bought the NFT!");

      // After successful purchase, update the ownership status.
      setIsOwner(true);
      setData({ ...data, owner: currAddress }); // Update data with new owner
    } catch (e) {
      setMessage("");
      alert("Transaction Error: " + e);
    }
  };

  const buyNFTWithERC20 = async (tokenId) => {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const erc20Contract = new ethers.Contract(
      myERC20Token.address,
      myERC20Token.abi,
      signer
    );
    const tokenAmount = ethers.utils.parseUnits(data.price, "ether");
    setMessage("Approving token transfer... Please wait.");

    try {
      const approvalTx = await erc20Contract.approve(
        nftMarketplaceERC20Payment.address,
        tokenAmount
      );
      await approvalTx.wait(); // Ensure approval is confirmed

      let paymentContract = new ethers.Contract(
        nftMarketplaceERC20Payment.address,
        nftMarketplaceERC20Payment.abi,
        signer
      );
      const transaction = await paymentContract.buyNFT(tokenId, tokenAmount);
      await transaction.wait(); // Ensure the transaction is confirmed

      // Update the ownership status immediately after the transaction is confirmed
      const newOwnerAddress = await signer.getAddress();
      setIsOwner(true); // Assume the current user is now the owner
      setData((prevData) => ({ ...prevData, owner: newOwnerAddress })); // Update the owner in the state
      setMessage("");
      alert("You successfully bought the NFT with ERC20 tokens!");
    } catch (e) {
      console.error("Transaction Error: ", e.message);
      setMessage("Transaction failed. Please try again.");
    }
  };

  return (
  <div style={{ "min-height": "100vh", display: "flex" }}>
  <Navbar />
  {/* Render NFT data here */}
  <div className="flex ml-auto mr-auto mt-40">
    <img
      src={data.image}
      alt=""
      className="h-3/4 w-2/4 border-xl-5 drop-shadow-2xl"
    />
    <div className="text-xl mt-40 ml-20 space-y-8 text-white rounded-lg">
      <div className="drop-shadow-xl font-bold text-2xl">Name: {data.name}</div>
      <div className="drop-shadow-xl font-bold">Description: {data.description}</div>
      <div className="drop-shadow-xl font-bold">
        Price: <span className="">{data.price + " ETH/ERC20 Token"}</span>
      </div>
      <div>
        Owner: <span className="text-sm">{data.owner}</span>
      </div>
      <div>
        Seller: <span className="text-sm">{data.seller}</span>
      </div>
      <div>
        {!isOwner &&
        currAddress !== data.owner &&
        currAddress !== data.seller ? (
          <div>
            <select
              className="payment-method-selector bg-white-500 text-black font-bold py-2 px-4 rounded text-md shadow-xl"
              style={{ marginRight: "8px" }}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="ETH">Pay with ETH</option>
              <option value="ERC20">Pay with ERC20 Token</option>
            </select>
            {paymentMethod === "ETH" ? (
              <button
                className="enableEthereumButton bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-md shadow-xl"
                style={{ marginTop: "8px" }}
                onClick={() => buyNFT(tokenId)}
              >
                Buy this NFT with ETH
              </button>
            ) : (
              <button
                className="enableEthereumButton bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-md shadow-xl"
                style={{ marginTop: "8px" }}
                onClick={() => buyNFTWithERC20(tokenId)}
              >
                Buy this NFT with ERC20
              </button>
            )}
          </div>
        ) : (
          <div className="text-emerald-700">
            You are the owner of this NFT
          </div>
        )}
        <div className="text-green text-center mt-3">{message}</div>
      </div>
    </div>
  </div>
</div>
  );
}