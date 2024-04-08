// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.20;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTMarketplace is ERC721URIStorage {
    error NFTMarketplace__OnlyOwnerCan_UpdateListingPrice();
    error NFTMarketplace__Incorrect_ListingPrice();
    error NFTMarketplace__Incorrect_BuyingPrice();
    error NFTMarketplace__PriceCannot_BeZero();
    error NFTMarketplace__TransferFailed();
    error NFTMarketplace__OnlyOwnerCan_ReSell();
    error NFTMarketplace__Item_NotForSale();
    
    struct MarketItem {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool sold;
        address paymentToken; // ERC20 token address
    }
    
    address payable private immutable i_owner;
    
    uint256 private s_tokenId;
    uint256 private s_itemsSold;
    uint256 private s_listingPrice = 0.01 ether;

    mapping(uint256 => MarketItem) private s_idToMarketItem;
    
    event MarketItemCreated(
        uint256 indexed tokenId, address indexed owner, address indexed seller, uint256 price, bool sold
    );

    constructor() ERC721("NFTMarketplace", "NFTM") {
        i_owner = payable(msg.sender);
    }
    
    function createToken(string memory tokenURI, uint256 price, address paymentToken) external returns (uint256) {
        require(price != 0, "Price cannot be zero");
        
        // Approve transfer from the caller to this contract
        IERC20(paymentToken).transferFrom(msg.sender, address(this), s_listingPrice);
        
        _mint(msg.sender, s_tokenId);
        _setTokenURI(s_tokenId, tokenURI);
        createMarketItem(s_tokenId, price, paymentToken);

        s_tokenId++;

        return s_tokenId - 1;
    }

    function executeSale(uint256 tokenId) external {
        uint256 price = s_idToMarketItem[tokenId].price;
        address seller = s_idToMarketItem[tokenId].seller;
        address paymentToken = s_idToMarketItem[tokenId].paymentToken;
        
        require(IERC20(paymentToken).allowance(msg.sender, address(this)) >= price, "Not enough allowance");

        // Transfer tokens from buyer to seller
        IERC20(paymentToken).transferFrom(msg.sender, seller, price);

        // Update item status
        s_idToMarketItem[tokenId].seller = payable(msg.sender);
        s_idToMarketItem[tokenId].sold = true;
        s_idToMarketItem[tokenId].owner = payable(msg.sender);

        s_itemsSold++;
        
        _transfer(address(this), msg.sender, tokenId);

        (bool sendListingFee,) = payable(i_owner).call{value: s_listingPrice}("");
        require(sendListingFee, "Failed to send listing fee");
    }

    function reSellNft(uint256 tokenId, uint256 price) external {
        address seller = s_idToMarketItem[tokenId].seller;
        address paymentToken = s_idToMarketItem[tokenId].paymentToken;
        
        require(seller == msg.sender, "Only the owner can re-sell");
        require(price != 0, "Price cannot be zero");

        // Approve transfer from the caller to this contract
        IERC20(paymentToken).transferFrom(msg.sender, address(this), s_listingPrice);

        s_idToMarketItem[tokenId].sold = false;
        s_idToMarketItem[tokenId].price = price;
        s_idToMarketItem[tokenId].owner = payable(address(this));

        _transfer(msg.sender, address(this), tokenId);

        s_itemsSold--;
    }

    function updateListingPrice(uint256 newPrice) external {
        require(msg.sender == i_owner, "Only owner can update listing price");
        require(newPrice != 0, "Price cannot be zero");
        s_listingPrice = newPrice;
    }
    
    function createMarketItem(uint256 _tokenId, uint256 _price, address _paymentToken) private {
        s_idToMarketItem[_tokenId] = MarketItem({
            tokenId: _tokenId,
            owner: payable(address(this)),
            seller: payable(msg.sender),
            price: _price,
            sold: false,
            paymentToken: _paymentToken
        });
        
        _transfer(msg.sender, address(this), _tokenId);
        
        emit MarketItemCreated(_tokenId, address(this), msg.sender, _price, false);
    }
    
    function getListingPrice() external view returns (uint256) {
        return s_listingPrice;
    }

    function getItemForTokenId(uint256 tokenId) external view returns (MarketItem memory) {
        return s_idToMarketItem[tokenId];
    }

    function getCurrentTokenId() external view returns (uint256) {
        return s_tokenId;
    }

    function getAllNFTs() external view returns (MarketItem[] memory) {
        MarketItem[] memory allNfts = new MarketItem[](s_tokenId);

        for (uint256 i = 0; i < s_tokenId; i++) {
            allNfts[i] = s_idToMarketItem[i];
        }

        return allNfts;
    }

    function getItemsSold() external view returns (uint256) {
        return s_itemsSold;
    }
}
