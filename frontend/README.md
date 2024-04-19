#  NFT Marketplace 

This web application is a decentralized NFT marketplace that allows users to create their own NFT collection from images at an IPFS url and view their NFT collection. It also allows the user to buy NFTs using ETH/ERC20 tokens. The app is hosted on IPFS at https://bafybeicknazprydwtrschet5cx7gi5szwyacrr3n6nhvrycye5wk6cffta.ipfs.cf-ipfs.com/

Note: For part B: We have implemented the add on functionality where users can pay for NFTs using custom ERC20 tokens (PRT Token).

## Features

- Mint NFTs with custom images and metadata.
- List your NFTs for sale.
- Buy NFTs from the marketplace using ETH/ERC20 tokens.
- View your NFT collection.

## Technologies Used

- Smart Contracts: Solidity built using Foundry
- Frontend: ReactJS
- IPFS: For storing NFT images and metadata 
- Blockchain: Sepolia Testnet

### Prerequisites

- [MetaMask](https://metamask.io/) Ethereum wallet provider.

To set up the repository, run the below
```bash
git clone https://github.com/tarunangrish-neu/nft-marketplace.git
Checkout to final-branch
npm install
```

Create a new .env file in the root of your project, which is right inside the NFT-Project folder, and add:
1)The Alchemy API URL 
2)The private key of the MetaMask wallet
3)API key of your Pinata account
4)Pinata secret

When you're done, your .env file should look like this:

```bash
REACT_APP_ALCHEMY_API_URL="<YOUR_API_URL>"
REACT_APP_PRIVATE_KEY="<YOUR_PRIVATE_KEY>"
REACT_APP_PINATA_KEY="<YOUR_PINATA_KEY>"
REACT_APP_PINATA_SECRET="<YOUR_PINATA_SECRET>"
```

On running npm start,the app should be available at [Localhost](http://localhost:3000/)

## Guide to use the application:
1)Once the app loads, connect your metamask wallet by clicking "Connect Wallet" button. Make sure you have sufficient ETH in your wallet. Also, ensure you are on the Sepolia test network.

2)Go to List My NFT tab and add your NFT to the marketplace by filling in the form.

3)Once your NFT is successfully listed on the marketplace, you can view the NFT on the Marketplace tab.

4)Click on any of the NFT images to view the NFT detail page. Now switch to a different account on your wallet to test the Buy NFT functionality. You can buy NFT using either ETH/ERC20 tokens by choosing the appropriate option from the dropdown and clicking on the buy button.

## Contributing
Contributions are welcome! If you'd like to contribute to [Your Project Name], please follow these guidelines:

Fork the repository
Create your feature branch (git checkout -b feature/YourFeature)
Commit your changes (git commit -m 'Add some feature')
Push to the branch (git push origin feature/YourFeature)
Open a pull request