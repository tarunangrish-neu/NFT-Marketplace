// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../contracts/MyERC20Token.sol";
import "hardhat/console.sol";

contract MyERC20TokenTest {
    MyERC20Token myToken;
    address owner;
    address testAccount1;
    address testAccount2;

    function beforeEach() public {
        owner = msg.sender;
        testAccount1 = address(1);
        testAccount2 = address(2);
        myToken = new MyERC20Token(1000000);
    }

    function testInitialBalanceUsingDeployedContract() public {
        uint256 balance = myToken.balanceOf(owner);
        console.log("Owner balance should have all tokens");
        require(balance == 1000000, "Owner should have 1000000 initially");
    }

    function testTransfer() public {
        myToken.transfer(testAccount1, 100);
        uint256 balance = myToken.balanceOf(testAccount1);
        console.log("testAccount1 balance should be 100 tokens");
        require(balance == 100, "testAccount1 should have 100 tokens after transfer");
    }
}
