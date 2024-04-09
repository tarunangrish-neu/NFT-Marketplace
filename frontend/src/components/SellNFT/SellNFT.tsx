"use client";

import React, { useState } from "react";
import FormField from "./FormField";
import FormTextArea from "./FormTextArea";
import { useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { deployedContract } from "@/constants/index";
import { useRouter } from "next/navigation";
import { pinFileToIPFS, pinJSONToIPFS } from "@/utils/Pinata";

type formFields = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
};

const initialFormState = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
};

const SellNft = () => {
  const address = useAddress();
  const router = useRouter();

  const { contract } = useContract(deployedContract);

  const { data: listingPrice, isLoading } = useContractRead(
    contract,
    "getListingPrice"
  );

  const [form, setForm] = useState<formFields>(initialFormState);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isListing, setIsListing] = useState(false);

  const handleFormFieldChange = (
    fieldName: keyof formFields,
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const callToBlockchain = async (imageUri: string) => {
    const priceInWei = ethers.utils.parseEther(form.price);

    try {
      const data = await contract?.call("createToken", [imageUri, priceInWei], {
        value: listingPrice,
      });
      router.push("/");
      setForm({ ...initialFormState });
    } catch (error) {
      console.log("Listing Nft to Marketplace Error");
    } finally {
      setIsListing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsListing(true);
    try {
      const metaData = {
        name: form.name,
        description: form.description,
        image: `ipfs://${form.imageUrl}`,
      };
      const pinataMetdata = await pinJSONToIPFS(metaData);
      callToBlockchain(pinataMetdata.data.IpfsHash);
    } catch (err) {
      console.error("Pinning Metadata to Pinata Error", err);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files) {
        setIsImageUploading(true);
        const pinataResult = await pinFileToIPFS(e.target.files[0]);
        setForm({ ...form, imageUrl: pinataResult.data.IpfsHash });
      }
    } catch (error) {
      console.log("Image Upload to Pinata Error", error);
    } finally {
      setIsImageUploading(false);
    }
  };

  return (
    <div className="container mx-auto my-10 pt-16">
      <div className="bg-white flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
        <div className="flex justify-center items-center p-[18px] sm:min-w-[380px] bg-[#1ebc6e] rounded-[10px]">
          <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white bg-[#1e0c6e]">
            Sell your NFT
          </h1>
        </div>
        {address ? (
          <form
            onSubmit={handleSubmit}
            className="w-full mt-[65px] flex flex-col gap-[30px]"
          >
            <div className="flex flex-wrap gap-[40px]">
              <FormField
                labelName="NFT Name *"
                placeholder="NFT Name"
                inputType="text"
                value={form.name}
                handleChange={(e) => handleFormFieldChange("name", e)}
              />
            </div>

            <FormTextArea
              labelName="NFT Description *"
              placeholder="NFT Description"
              value={form.description}
              handleChange={(e) => handleFormFieldChange("description", e)}
            />

            <div className="flex flex-wrap gap-[40px]">
              <FormField
                labelName="Price *"
                placeholder="Price in ETH"
                inputType="number"
                value={form.price}
                handleChange={(e) => handleFormFieldChange("price", e)}
              />
            </div>

            <div className="flex-1 w-full flex flex-col">
              <div className="font-semibold text-[16px] leading-[22px] text-[#1e0c6e] mb-[10px]">
                NFT Image *
              </div>

              <input
                required
                onChange={onFileChange}
                type="file"
                className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[3px] border-[#1e0c6e] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] cursor-pointer"
              />
            </div>

            <div className="flex justify-center items-center mt-[40px]">
              {isImageUploading ? (
                <div className="bg-gray-500 px-16 rounded py-3">
                  Image Uploading...
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isListing}
                  className="bg-[#1e0c6e] px-16 rounded py-3 text-[#ffffff] text-[22px] rounded-[80px] transition-transform transform hover:scale-110"
                >
                  {isListing ? "Listing..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="mt-10 font-semibold align-center text-[20px] text-[#1e0c6e]">
            Connect your wallet to list an NFT.
          </div>
        )}
      </div>
    </div>
  );
};

export default SellNft;
