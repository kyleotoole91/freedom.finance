const Token = artifacts.require("Token");
const FreedomFinance = artifacts.require("FreedomFinance");

module.exports = async function(deployer) {
  await deployer.deploy(Token);
  const token = await Token.deployed();

  await deployer.deploy(FreedomFinance, token.address);
  const freedomFinance = await FreedomFinance.deployed();

  //Transfer all tokens to EthSwap exchange
  await token.transfer(freedomFinance.address, "1000000000000000000000000");
};
