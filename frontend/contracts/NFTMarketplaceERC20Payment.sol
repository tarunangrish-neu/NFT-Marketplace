// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NFTMarketplace.sol";

contract NFTMarketplaceERC20Payment {
    NFTMarketplace public nftMarketplace;
    IERC20 public erc20Token;

    constructor(address _nftMarketplaceAddress, address _erc20TokenAddress) {
        nftMarketplace = NFTMarketplace(_nftMarketplaceAddress);
        erc20Token = IERC20(_erc20TokenAddress);
    }

    function buyNFT(uint256 _tokenId, uint256 _price) external {
        require(erc20Token.transferFrom(msg.sender, address(this), _price), "Payment failed");
        
        // Assuming your marketplace contract has a function to facilitate transfer without direct payment
        nftMarketplace.safeTransferNFT(msg.sender, _tokenId);

        // Transfer the ERC20 tokens from this contract to the seller
        address seller = nftMarketplace.ownerOf(_tokenId);
        require(erc20Token.transfer(seller, _price), "Failed to transfer ERC20 to seller");
    }

    // Add any additional functions here
}
