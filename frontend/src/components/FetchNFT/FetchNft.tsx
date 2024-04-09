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

    const {
        data: nft,
        isLoading,
        isSuccess,
        refetch,
    } = useContractRead(contract, "getItemForTokenId", [id]);

    const { data: listingPrice } = useContractRead(contract, "getListingPrice");

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

    

export default FetchNft;
