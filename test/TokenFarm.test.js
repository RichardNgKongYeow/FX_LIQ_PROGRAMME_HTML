const TetherToken = artifacts.require('TetherToken')
const PeceiptToken = artifacts.require('PeceiptToken')
const DepositWallet = artifacts.require('DepositWallet')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('DepositWallet', ([owner, investor]) => {
  let tetherToken, peceiptToken, depositWallet

  before(async () => {
    // Load Contracts
    tetherToken = await TetherToken.new()
    peceiptToken = await PeceiptToken.new()
    depositWallet = await DepositWallet.new(peceiptToken.address, tetherToken.address)

    // Transfer all Peceipt tokens to farm (1 million)
    await peceiptToken.transfer(depositWallet.address, tokens('1000000'))

    // Send tokens to investor
    await tetherToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('Mock Tether deployment', async () => {
    it('has a name', async () => {
      const name = await tetherToken.name()
      assert.equal(name, 'Mock USDT')
    })
  })

  describe('Peceipt Token deployment', async () => {
    it('has a name', async () => {
      const name = await peceiptToken.name()
      assert.equal(name, 'PFX Token')
    })
  })

  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await depositWallet.name()
      assert.equal(name, 'Deposit Wallet')
    })

    it('contract has tokens', async () => {
      let balance = await peceiptToken.balanceOf(depositWallet.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('Farming tokens', async () => {

    it('rewards investors for staking mTether tokens', async () => {
      let result

      // Check investor balance before staking
      result = await tetherToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock tether wallet balance correct before staking')

      // Stake Mock DAI Tokens
      await tetherToken.approve(depositWallet.address, tokens('100'), { from: investor })
      await depositWallet.stakeTokens(tokens('100'), { from: investor })

      // Check staking result
      result = await tetherToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('0'), 'investor Mock Tether wallet balance correct after staking')

      result = await tetherToken.balanceOf(depositWallet.address)
      assert.equal(result.toString(), tokens('100'), 'Token Farm Mock Tether balance correct after staking')

      result = await depositWallet.stakingBalance(investor)
      assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

      result = await depositWallet.isStaking(investor)
      assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

      // Issue Tokens
      await depositWallet.issueTokens({ from: owner })

      // Check balances after issuance
      result = await peceiptToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Peceipt Token wallet balance correct affter issuance')

      // Ensure that only onwer can issue tokens
      await depositWallet.issueTokens({ from: investor }).should.be.rejected;

      // Unstake tokens
      await depositWallet.unstakeTokens({ from: investor })

      // Check results after unstaking
      result = await tetherToken.balanceOf(investor)
      assert.equal(result.toString(), tokens('100'), 'investor Mock Tether wallet balance correct after staking')

      result = await tetherToken.balanceOf(depositWallet.address)
      assert.equal(result.toString(), tokens('0'), 'Token Farm Mock Tether balance correct after staking')

      result = await depositWallet.stakingBalance(investor)
      assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

      result = await depositWallet.isStaking(investor)
      assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
    })
  })

})
