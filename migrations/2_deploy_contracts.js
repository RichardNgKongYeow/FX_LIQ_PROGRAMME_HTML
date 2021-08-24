const DepositWallet = artifacts.require("DepositWallet");
const PeceiptToken = artifacts.require("PeceiptToken");
const TetherToken = artifacts.require("TetherToken");


// network is for network and accounts is to allow people to have access to all accounts
module.exports = async function(deployer, network, accounts) {
    
    // deploy mocktether & peceipt tokens...can remove the tether token and get real one
    // deploy mock tethertoken
    await deployer.deploy(TetherToken)
    const tetherToken = await TetherToken.deployed()
    
    // deploy lp peceipttoken
    await deployer.deploy(PeceiptToken)
    const peceiptToken = await PeceiptToken.deployed()
    
    // deploy depositwallet and pass in variables taken in in constructor ie the 2 token addresses
    await deployer.deploy(DepositWallet, peceiptToken.address, tetherToken.address)
    const depositWallet = await DepositWallet.deployed()

    // transfer all lp tokens to DepositWallet
    await peceiptToken.transfer(depositWallet.address,'1000000000000000000000000')

    // transfer 100 mock USDT tokens to investor
    // second account in ganache
    await tetherToken.transfer(accounts[1],'100000000000000000000')

    // transfer 100 mock USDT tokens to investor
    // third account in ganache
    await tetherToken.transfer(accounts[2],'100000000000000000000')

    // transfer 100 mock USDT tokens to investor
    // forth account in ganache
    await tetherToken.transfer(accounts[3],'100000000000000000000')
};
