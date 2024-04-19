const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const balance = await deployer.getBalance();
    console.log("Account balance:", balance.toString());

    // Deploy NFT Marketplace contract
    const Marketplace = await ethers.getContractFactory("NFTMarketplace");
    const marketplace = await Marketplace.deploy();
    await marketplace.deployed();
    console.log("Marketplace deployed to:", marketplace.address);

    // Deploy ERC20 Token contract
    const MyERC20Token = await ethers.getContractFactory("MyERC20Token");
    const myERC20Token = await MyERC20Token.deploy(ethers.utils.parseEther("100")); // Supply 1,000,000 tokens for example
    await myERC20Token.deployed();
    console.log("ERC20 Token deployed to:", myERC20Token.address);

    // Deploy ERC20 Payment contract for NFT Marketplace
    const NFTMarketplaceERC20Payment = await ethers.getContractFactory("NFTMarketplaceERC20Payment");
    const nftMarketplaceERC20Payment = await NFTMarketplaceERC20Payment.deploy(marketplace.address, myERC20Token.address);
    await nftMarketplaceERC20Payment.deployed();
    console.log("NFT Marketplace ERC20 Payment contract deployed to:", nftMarketplaceERC20Payment.address);

    // Set ERC20 Payment contract in NFT Marketplace
    await marketplace.setERC20PaymentContract(nftMarketplaceERC20Payment.address);
    console.log("ERC20 Payment Contract set in the NFT Marketplace");

    // Save contracts' addresses and ABIs
    fs.writeFileSync('./src/marketplace.json', JSON.stringify({
        address: marketplace.address,
        abi: JSON.parse(marketplace.interface.format('json')),
    }));

    fs.writeFileSync('./src/myERC20Token.json', JSON.stringify({
        address: myERC20Token.address,
        abi: JSON.parse(myERC20Token.interface.format('json')),
    }));

    fs.writeFileSync('./src/nftMarketplaceERC20Payment.json', JSON.stringify({
        address: nftMarketplaceERC20Payment.address,
        abi: JSON.parse(nftMarketplaceERC20Payment.interface.format('json')),
    }));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
