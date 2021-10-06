// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Token.sol";

contract FreedomFinance {
  string public name = "Freedom.Finance";
  Token public token;
  uint public rate = 100; //100 FDM tokens = 1 Ether

  event TokenPurchased( 
    address account,
    address token,
    uint amount,
    uint rate
  );

  constructor(Token _token) {
    token = _token;  
  }

 function buyTokens() public payable {
    //msg.sender who called this function. 
    //msg.value amount of Ether sent into the exchange
    uint tokenAmount = msg.value * rate;
    token.transfer(msg.sender, tokenAmount);

    // Emit an event
    emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
  }
}