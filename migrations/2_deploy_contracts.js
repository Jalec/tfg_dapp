//The purpose of this file is to deploy our smart-contracts on the blockchain

const Token = artifacts.require("Token");
const TFGSwap = artifacts.require("TFGSwap");

module.exports = async function(deployer) {

  //Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed()

  //Deploy TFGSwap
  await deployer.deploy(TFGSwap, token.address);
  const tfgSwap = await TFGSwap.deployed()

  //Transfer all tokens to TFGSwap
  await token.transfer(tfgSwap.address, '1000000000000000000000000');
};
