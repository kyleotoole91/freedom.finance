// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Token.sol";

contract FreedomFinance {
  string public name = "Freedom.Finance";
  string public symbol = "FDM";
  Token public token;
  uint public rate = 100; //100 FDM tokens = 1 Ether

  event TokenPurchased( 
    address account,
    address token,
    uint amount,
    uint rate
  );

  event TokenSold( 
    address account,
    address token,
    uint amount,
    uint rate
  );

  constructor(Token _token) {
    token = _token;  
  }

 function buyTokens() public payable {
    uint purchaseAmount = msg.value * rate;
    uint tokenLiquidity = token.balanceOf(address(this));
    //Check if the exchange has enough tokens. require() exist the function when false
    require(tokenLiquidity >= purchaseAmount);
    //transfer tokens to the user
    token.transfer(msg.sender, purchaseAmount);
    // Emit an event
    emit TokenPurchased(msg.sender, address(token), purchaseAmount, rate);
  }

  function sellTokens(uint _amount) public payable {
    //user cannot sell more tokens than they own
    require(token.balanceOf(msg.sender) >= _amount);
    //check Ether balance is enough
    uint etherAmount = _amount / rate;
    require(address(this).balance >= etherAmount);
    // Take the user tokens
    token.transferFrom(msg.sender, address(this), _amount); 
    // Pay the user ether
    payable(msg.sender).transfer(etherAmount);
    // Emit an event
    emit TokenSold(msg.sender, address(token), _amount, rate);
  }
}