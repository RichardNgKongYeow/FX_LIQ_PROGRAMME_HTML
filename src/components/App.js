import React, { Component } from 'react'
import Web3 from 'web3'
import TetherToken from '../abis/TetherToken.json'
import PeceiptToken from '../abis/PeceiptToken.json'
import DepositWallet from '../abis/DepositWallet.json'
import Navbar from './Navbar'
import Main from './Main'
import Stake from './Stake'
import Unstake from './Unstake'
import Owner from './Owner'
import './App.css'
import { BrowserRouter as Router,Switch, Route} from 'react-router-dom';


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()

    // Load tetherToken

    const tetherTokenData = TetherToken.networks[networkId]
    if(tetherTokenData) {
      const tetherToken = new web3.eth.Contract(TetherToken.abi, tetherTokenData.address)
      this.setState({ tetherToken })
      let tetherTokenBalance = await tetherToken.methods.balanceOf(this.state.account).call()
      this.setState({ tetherTokenBalance: tetherTokenBalance.toString() })
    } else {
      window.alert('TetherToken contract not deployed to detected network.')
    }

    // Load PeceiptToken
    const peceiptTokenData = PeceiptToken.networks[networkId]
    if(peceiptTokenData) {
      const peceiptToken = new web3.eth.Contract(PeceiptToken.abi, peceiptTokenData.address)
      this.setState({ peceiptToken })
      let peceiptTokenBalance = await peceiptToken.methods.balanceOf(this.state.account).call()
      this.setState({ peceiptTokenBalance: peceiptTokenBalance.toString() })
    } else {
      window.alert('PeceiptToken contract not deployed to detected network.')
    }

    // Load DepositWallet
    const depositWalletData = DepositWallet.networks[networkId]
    if(depositWalletData) {
      const tetherToken = new web3.eth.Contract(TetherToken.abi, tetherTokenData.address)
      const depositWallet = new web3.eth.Contract(DepositWallet.abi, depositWalletData.address)
      this.setState({ depositWallet })
      console.log(depositWallet)

      let tetherTokenInContract = await tetherToken.methods.balanceOf(depositWalletData.address).call()
      let mUSDTpool=await depositWallet.methods.mUSDTpool().call()
      let mUSDTfees=await depositWallet.methods.mUSDTfees().call()
      let PFXincirculation= await depositWallet.methods.PFXincirculation().call()
      let mUSDTtoPFX= await depositWallet.methods.mUSDTtoPFX().call()
      let PFXtomUSDT= await depositWallet.methods.PFXtomUSDT().call()
      let stakingFee= await depositWallet.methods.stakingFee().call()
      this.setState({ tetherTokenInContract })
      this.setState({ mUSDTpool})
      this.setState({ mUSDTfees})
      this.setState({ PFXincirculation})
      this.setState({ mUSDTtoPFX})
      this.setState({ PFXtomUSDT})
      this.setState({ stakingFee})
    } else {
      window.alert('DepositWallet contract not deployed to detected network.')
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tetherToken.methods.approve(this.state.depositWallet._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.depositWallet.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.peceiptToken.methods.approve(this.state.depositWallet._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.depositWallet.methods.unstakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })

      })
    })
  }

  withdrawTetherFromPool = (amount) => {
    this.setState({ loading: true })
    this.state.depositWallet.methods.withdrawTetherFromPool(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })

      })
  
  }
  addTetherToPool = (amount) => {
    this.setState({ loading: true })
    this.state.tetherToken.methods.approve(this.state.depositWallet._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
    this.state.depositWallet.methods.addTetherToPool(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })

      })
    })
  }
  transferTetherFromFeesToPool = (amount) => {
    this.setState({ loading: true })
    this.state.depositWallet.methods.transferTetherFromFeesToPool(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
      })
    }

  withdrawTetherFromFees = (amount) => {
    this.setState({ loading: true })
    this.state.depositWallet.methods.withdrawTetherFromFees(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })

      })
    
    }
  
  
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      tetherToken: {},
      peceiptToken: {},
      depositWallet: {},
      tetherTokenBalance: '0',
      peceiptTokenBalance: '0',
      tetherTokenInContract: '0',
      mUSDTpool:'0',
      mUSDTfees:'0',
      PFXincirculation:'0',
      mUSDTtoPFX:'0',
      PFXtomUSDT:'0',
      stakingFee:'0',
      loading: true,

    }
  }

  render() {
    let maincontent
    let stakecontent
    let unstakecontent
    let ownercontent
    if(this.state.loading) {
      maincontent =
      <div class="wrap">
      <div class="loading">
        <div class="bounceball"></div>
        <div class="text">ETHEREUM IS A LITTLE SLOW...</div>
      </div>
    </div>
      stakecontent =
      <div class="wrap">
      <div class="loading">
        <div class="bounceball"></div>
        <div class="text">ETHEREUM IS A LITTLE SLOW...</div>
      </div>
    </div>
    } else {
      maincontent = <Main
        tetherTokenBalance={this.state.tetherTokenBalance}
        peceiptTokenBalance={this.state.peceiptTokenBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
        tetherTokenInContract={this.state.tetherTokenInContract}
        mUSDTpool={this.state.mUSDTpool}
        mUSDTfees={this.state.mUSDTfees}
        PFXincirculation={this.state.PFXincirculation}
        mUSDTtoPFX={this.state.mUSDTtoPFX}
        PFXtomUSDT={this.state.PFXtomUSDT}
        stakingFee={this.state.stakingFee}
      />
        stakecontent = <Stake
        tetherTokenBalance={this.state.tetherTokenBalance}
        peceiptTokenBalance={this.state.peceiptTokenBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
        tetherTokenInContract={this.state.tetherTokenInContract}
        mUSDTpool={this.state.mUSDTpool}
        mUSDTfees={this.state.mUSDTfees}
        PFXincirculation={this.state.PFXincirculation}
        mUSDTtoPFX={this.state.mUSDTtoPFX}
        PFXtomUSDT={this.state.PFXtomUSDT}
        stakingFee={this.state.stakingFee}
      />
        unstakecontent = <Unstake
        tetherTokenBalance={this.state.tetherTokenBalance}
        peceiptTokenBalance={this.state.peceiptTokenBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
        tetherTokenInContract={this.state.tetherTokenInContract}
        mUSDTpool={this.state.mUSDTpool}
        mUSDTfees={this.state.mUSDTfees}
        PFXincirculation={this.state.PFXincirculation}
        mUSDTtoPFX={this.state.mUSDTtoPFX}
        PFXtomUSDT={this.state.PFXtomUSDT}
        stakingFee={this.state.stakingFee}
      />
        ownercontent = <Owner
        tetherTokenBalance={this.state.tetherTokenBalance}
        peceiptTokenBalance={this.state.peceiptTokenBalance}
        withdrawTetherFromPool={this.withdrawTetherFromPool}
        addTetherToPool={this.addTetherToPool}
        transferTetherFromFeesToPool={this.transferTetherFromFeesToPool}
        withdrawTetherFromFees={this.withdrawTetherFromFees}
        tetherTokenInContract={this.state.tetherTokenInContract}
        mUSDTpool={this.state.mUSDTpool}
        mUSDTfees={this.state.mUSDTfees}
        PFXincirculation={this.state.PFXincirculation}
        mUSDTtoPFX={this.state.mUSDTtoPFX}
        PFXtomUSDT={this.state.PFXtomUSDT}
        stakingFee={this.state.stakingFee}
      />


      
    }

    return (
      <Router>
      <div>
        
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">

            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://www.pundix.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                  {/* {content} */}
                  <Switch>
                    {/* <Route path="/" exact > {content} </Route> */}
                    <Route path="/" exact > {maincontent} </Route>
                    <Route path="/stake/" exact > {stakecontent} </Route>
                    <Route path="/unstake/" exact > {unstakecontent} </Route>
                    <Route path="/owner/" exact > {ownercontent} </Route>
                    {/* <Route path="/PRTokenDistribution/NPXSXEMigration/" exact > {content2} </Route>
                    <Route path="/PRTokenDistribution/PurseDistribution/" exact > {content3} </Route> */}
                  </Switch>
              </div>
            </main>
          </div>
        </div>

        
      </div>
      </Router>
    );
  }
}

export default App;