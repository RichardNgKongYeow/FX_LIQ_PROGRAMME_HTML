const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(callback) {
  let depositWallet = await DepositWallet.deployed()
  await depositWallet.issueTokens()
  // Code goes here...
  console.log("Tokens issued!")
  callback()
}
