// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../contracts/NFTMarketplaceERC20Payment.sol";
import "../contracts/NFTMarketplace.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract NFTMarketplaceERC20PaymentTest {
    NFTMarketplace private nftMarketplace;
    ERC20 private erc20Token;
    NFTMarketplaceERC20Payment private paymentContract;

    address private owner;
    address private buyer;
    address private seller;

    uint256 private tokenId;
    uint256 private price = 1000; // Set an appropriate price for testing

    function beforeEach() public {
        owner = msg.sender;
        buyer = address(1);
        seller = address(2);

        // Deploy the ERC20 token and mint tokens to buyer for testing
        erc20Token = new ERC20("TestToken", "TT");
        erc20Token.mint(buyer, 10000);

        // Deploy the NFT marketplace and create a test NFT owned by seller
        nftMarketplace = new NFTMarketplace();
        tokenId = nftMarketplace.createToken("test-uri", price);

        // Transfer ownership of the NFT to the seller for testing
        nftMarketplace.safeTransferFrom(owner, seller, tokenId);

        // Deploy the payment contract with the addresses of the marketplace and ERC20 token
        paymentContract = new NFTMarketplaceERC20Payment(address(nftMarketplace), address(erc20Token));

        // Approve the payment contract to spend buyer's tokens
        erc20Token.approve(address(paymentContract), 10000, {from: buyer});
    }

    function testBuyNFT() public {
        // Buyer executes buyNFT function
        paymentContract.buyNFT(tokenId, price, {from: buyer});

        // Test that the buyer now owns the NFT
        require(nftMarketplace.ownerOf(tokenId) == buyer, "Buyer should own the NFT after purchase");

        // Test that the ERC20 tokens have been transferred from buyer to seller
        uint256 sellerBalance = erc20Token.balanceOf(seller);
        require(sellerBalance == price, "Seller should receive tokens equal to price of NFT");
        
        // Test that the contract's token balance has returned to zero
        uint256 contractBalance = erc20Token.balanceOf(address(paymentContract));
        require(contractBalance == 0, "Payment contract should have a zero token balance after sale");

        // Add more checks as needed...
    }

    // Additional test functions...
}
