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