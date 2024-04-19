// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// Import this contract from the path where it is located in your project
import "../contracts/NFTMarketplace.sol";

// We'll use the Test contract provided by Hardhat for testing
contract NFTMarketplaceTest is Test {
    NFTMarketplace marketplace;
    uint256 public listPrice = 0.01 ether;
    string public tokenURI = "https://token-cdn-domain/{id}.json";
    uint256 public sellingPrice = 1 ether;

    // Set up your test environment
    function setUp() public {
        marketplace = new NFTMarketplace();
    }

    // Test token creation and automatic listing
    function testCreateToken() public {
        uint256 tokenId = marketplace.createToken{value: listPrice}(tokenURI, sellingPrice);
        assertEq(marketplace.ownerOf(tokenId), address(marketplace));
        (, , , uint256 price, bool currentlyListed) = marketplace.getListedTokenForId(tokenId);
        assertEq(price, sellingPrice);
        assertTrue(currentlyListed);
    }

    // Test getting all NFTs
    function testGetAllNFTs() public {
        // First, create a token
        uint256 tokenId = marketplace.createToken{value: listPrice}(tokenURI, sellingPrice);
        // Then, get all listed tokens
        NFTMarketplace.ListedToken[] memory allTokens = marketplace.getAllNFTs();
        assertTrue(allTokens.length > 0);
        assertEq(allTokens[0].tokenId, tokenId);
    }

    // Test getting NFTs owned/sold by a user
    function testGetMyNFTs() public {
        // Assuming the marketplace contract has a way to list a token
        uint256 tokenId = marketplace.createToken{value: listPrice}(tokenURI, sellingPrice);
        // The test framework should handle paying for the token and transferring it to the tester
        marketplace.executeSale{value: sellingPrice}(tokenId);
        // Now check that the token is among the tester's NFTs
        NFTMarketplace.ListedToken[] memory myTokens = marketplace.getMyNFTs();
        assertTrue(myTokens.length > 0);
        assertEq(myTokens[0].tokenId, tokenId);
    }

    // Test purchasing an NFT
    function testExecuteSale() public {
        uint256 tokenId = marketplace.createToken{value: listPrice}(tokenURI, sellingPrice);
        // Setup another user
        address buyer = address(0x2);
        // Simulate the buyer purchasing the NFT
        vm.prank(buyer);
        marketplace.executeSale{value: sellingPrice}(tokenId);
        // Verify the new owner
        assertEq(marketplace.ownerOf(tokenId), buyer);
    }

    // Test update listing price
    function testUpdateListPrice() public {
        // Only the owner should be able to update the listing price
        uint256 newPrice = 0.02 ether;
        marketplace.updateListPrice(newPrice);
        assertEq(marketplace.getListPrice(), newPrice);
    }
}
