Setting Up
Getting the modules and dependencies:
1) run gitbash terminal and npm install --g truffle
2) npm install (bash)


Deploying smart contracts to your ganache server, you may config and deploy unto the testnet too
1) truffle --compile (bash) --> check to see everything is fine
2) truffle migrate --network development (bash)  --> deploying to development network
3) to deploy on a testnet, edit the truffle-config.js file
  a) infuraKey-->change this to your infura key
  b) under network provider-->choose your network ropsten...and change infura key
4) add/edit the .secret file and put mnemonic in from your metamask wallet-->settings-->privacy-->reveal seed phrase-->copy and paste into .secret
5) install hd wallet provider npm install @truffle/hdwallet-provider
6) truffle migrate --network rinkeby

Running the app:
1) npm start --> this should open a browser and bring you to the html page to buy and sell tokens
2) all string inputs into that form and click the required function denoted in the button to input that amount into that function
3) and execute to transact --> this will link to your metamask wallet to transact (make sure you import the necessary accounts from ganache client to metamask)


Functionalities of the app:
Functionalities of the app:
1)	User
  a.	Stake:
    i.	When a user stakes, they will deposit USDT into the contract and receive an LP (PFX) token.
    ii.	The moment any user stakes, they will incur a 3% management fee. 97% of the amount staked will go to the USDT pool, receiving the equivalent amount in LP tokens. The other 3% will go into the fees pool. (LP tokens are free to transfer amongst users)
    iii.	The exchange rate of USDT to PFX and vice versa reflects the ratio of USDT in the pool versus the PFX token in circulation.
    iv.	Example 1: When UserA stakes 100USDT (when 1USDT=1PFX), 97USDT will go to the USDT pool and the other 3 will go to the USDT fees. He will receive 97 PFX.
    v.	Example 2 (pool value increased): UserA stakes 100USDT. However, at the time of staking, the 1USDT=0.5PFX (pool has doubled in value). He will receive (100*0.5)*0.97=48.5PFX
    vi.	Example 3 (pool value decreased): UserA stakes 100USDT. However, at the time of staking, the 1USDT=2PFX (pool has halved in value). He will receive (100*2)*0.97=194PFX
    vii.	
  b.	Unstake:
    i.	When a user unstakes, they will deposit PFX token back into the pool and receive the amount of USDT based on the current exchange rate of the pool.
    ii.	Example 1: When UserA unstakes 100PFX (when 1PFX=1USDT), 100PFX will be transferred to the contract and he will receive 100USDT.
    iii.	Example 2 (pool value increased): UserA unstakes 100PFX. However, at the time of unstaking, the 1PFX=2USDT (pool has doubled in value). He will receive 100*2=200USDT
    iv.	Example 3 (pool value decreased): UserA unstakes 100PFX. However, at the time of unstaking, the 1PFX=0.5USDT (pool has halved in value). He will receive 100*0.5=50USDT
2)	Owner:
The owner will use a bridge to monitor the value of the pool in the f(x)core blockchain network. Based on the changes in the pool in f(x) core, the owner will 
  a.	Withdraw USDT from Pool
  b.	Add USDT to pool
   i.	Both functions will affect the exchange rate and the value of USDT in the pool
The owner also has the option of withdrawing from the Fees pool or transferring the fees back to the main pool.
  c.	Transfer USDT from Fees to pool
  d.	Withdraw USDT from Fees.
   i.	Transferring USDT from fees to pool will affect the exchange rate and overall value of the main pool.

