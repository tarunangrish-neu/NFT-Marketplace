"use client";
import { useEffect, useState } from "react";
import { useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import FormField from "../SellNft/FormField";
import { ethers } from "ethers";

type FetchNftPropTypes = {
    id: string;
};

const FetchNft = ({ id }: FetchNftPropTypes) => {
    const router = useRouter();
    const { contract } = useContract(deployedContract);
    const address = useAddress();

    const [nftName, setNftName] = useState("");
    const [nftDesc, setNftDesc] = useState("");
    const [nftImage, setNftImage] = useState("");
    const [fetchingData, setFetchingData] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [sellingPrice, setSellingPrice] = useState("0");
    const [isReselling, setIsReselling] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            setFetchingData(true);
            const metadataDetails = async () => {
                try {
                    const tokenUri = await contract?.call("tokenURI", [
                        nft.tokenId,
                    ]);
    
                    const metadata = await getPinataUrl(tokenUri);
                    const { name, description, image } = metadata.data;
                    const imageData = await getImageFromPinata(image);
    
                    setNftName(name);
                    setNftDesc(description);
                    setNftImage(imageData);
                } catch (error) {
                    console.log(error);
                } finally {
                    setFetchingData(false);
                }
            };

            metadataDetails();
        }
    }, [isSuccess, contract, nft]);

    const buyNft = async () => {
        setIsBuying(true);
        try {
            await contract?.call("executeSale", [id], {
                value: nft.price,
            });
            refetch();
        } catch (error) {
            console.log(error);
        } finally {
            setIsBuying(false);
        }
    };
    if (isSuccess) {
        return (
            <div className="flex flex-col items-center">
                <img
                    src={nftImage}
                    alt="No Thumbnail Found"
                    className="w-[640px] h-[480px] object-cover rounded-xl shadow-xl"
                />
                <div className="mt-4 w-[640px]">
                    <div className="flex justify-between gap-20">
                        <div>
                            <p className="font-bold text-[22px]">Name:</p>
                            <p>{nftName}</p>
                        </div>
                        <div>
                            <p className="font-bold text-[22px]">Price:</p>
                            <p>{ethers.utils.formatEther(nft.price.toString())} ETH</p>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <p className="font-bold text-[20px] text-[#1e0c6e]">
                            {address == nft.owner ? (
                                "You own this NFT"
                            ) : (
                                <button
                                    onClick={buyNft}
                                    disabled={isBuying || nft.sold}
                                    className="bg-[#1e0c6e] text-white px-20 py-6 rounded-[40px] transition-transform transform hover:scale-110"
                                    style={{ minWidth: "150px" }}
                                >
                                    {isBuying ? "Buying..." : "Buy"}
                                </button>
                            )}
                        </p>
                    </div>
                    {address == nft.owner && (
                        <form onSubmit={(e) => reSellNft(e)} className="mt-4 text-black">
                            <FormField
                                labelName="Sell Price *"
                                placeholder="Price in ETH"
                                inputType="number"
                                value={sellingPrice}
                                handleChange={(e) => setSellingPrice(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={isReselling}
                                className="bg-[#1e0c6e] text-white px-4 py-2 rounded mt-4"
                            >
                                {isReselling ? "Selling..." : "Sell"}
                            </button>
                        </form>
                    )}
                    <div className="flex flex-col">
                    <div className="mt-4">
                        <h4 className="text-xl font-bold text-black-300">Owner</h4>
                        <p className="text-sm text-gray-800">{nft.owner}</p>
                        </div>
                        <div className="mt-4">
                        <h4 className="text-xl font-bold text-black-300">Description</h4>
                        <p className="text-sm text-gray-800">{nftDesc}</p>
                    </div>
                    </div>
                </div>
            </div>
        );
    }

    return null; // Render nothing if neither loading nor successful
};

export default FetchNft;

