import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from "../Marketplace.json";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function SellNFT() {
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [fileURL, setFileURL] = useState(null);
  const ethers = require("ethers");
  const [message, updateMessage] = useState("");
  const navigate = useNavigate();

  async function disableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = true;
    listButton.style.backgroundColor = "grey";
    listButton.style.opacity = 0.3;
  }

  async function enableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = false;
    listButton.style.backgroundColor = "#000000";
    listButton.style.opacity = 1;
  }

  //This function uploads the NFT image to IPFS
  async function OnChangeFile(e) {
    var file = e.target.files[0];
    //check for file extension
    try {
      //upload the file to IPFS
      disableButton();
      updateMessage("Uploading image");
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        enableButton();
        updateMessage("");
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        setFileURL(response.pinataURL);
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }

  return (
    <div className="">
      <Navbar />
      <div className=" mt-20 flex flex-col place-items-center" id="nftForm">
        <form className="shadow-lg border-black border-2 w-2/5 text-center rounded-lg px-8 pt-4 pb-8 mb-4 mt-4">
          <h3 className="text-center text-2xl font-bold text-black mb-8">
            Upload your NFT to the Marketplace
          </h3>
          <div className="mb-4">
            <label
              className="block text-black text-lg font-bold mb-2"
              htmlFor="name"
            >
              NFT Name
            </label>
            <input
              className="shadow appearance-none rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-black border-2"
              id="name"
              type="text"
              placeholder="Image Name"
              onChange={(e) =>
                updateFormParams({ ...formParams, name: e.target.value })
              }
              value={formParams.name}
            ></input>
          </div>
          <div className="mb-6">
            <label
              className="block text-black text-lg font-bold mb-2"
              htmlFor="description"
            >
              NFT Description
            </label>
            <textarea
              className="shadow appearance-none border-black border-2 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              cols="40"
              rows="5"
              id="description"
              type="text"
              placeholder="Image Description"
              value={formParams.description}
              onChange={(e) =>
                updateFormParams({ ...formParams, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-6">
            <label
              className="block text-black text-lg font-bold mb-2"
              htmlFor="price"
            >
              Price (in ETH/ERC20 Token)
            </label>
            <input
              className="shadow appearance-none border-black border-2 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Min 0.01 ETH"
              step="0.01"
              value={formParams.price}
              onChange={(e) =>
                updateFormParams({ ...formParams, price: e.target.value })
              }
            ></input>
          </div>
          <div>
            <label
              className="block text-black text-lg font-bold mb-2"
              htmlFor="image"
            >
              Upload Image
            </label>
            <input
              type={"file"}
              accept=".jpg, jpeg, .png"
              onChange={OnChangeFile}
            ></input>
          </div>
          <br></br>
          <div className="text-white-600 text-xl text-center">{message}</div>
          <button
            onClick={listNFT}
            className="font-bold mt-10 bg-black text-white hover:bg-black hover:text-white rounded text-xl p-2 shadow-lg w-max transition-transform transform hover:scale-110"
            id="list-button"
          >
            List Your NFT
          </button>
        </form>
      </div>
    </div>
  );
}
