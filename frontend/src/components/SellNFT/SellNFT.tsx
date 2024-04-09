"use client";

import React, { useState } from "react";


import { useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";

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