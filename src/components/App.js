import React, { Component } from 'react'
import Web3 from 'web3'
import TetherToken from '../abis/TetherToken.json'
import PeceiptToken from '../abis/PeceiptToken.json'
import DepositWallet from '../abis/DepositWallet.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

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
      const depositWallet = new web3.eth.Contract(DepositWallet.abi, depositWalletData.address)
      this.setState({ depositWallet })
      let stakingBalance = await depositWallet.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString() })
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
  
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      tetherToken: {},
      peceiptToken: {},
      depositWallet: {},
      tetherTokenBalance: '0',
      peceiptTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        tetherTokenBalance={this.state.tetherTokenBalance}
        peceiptTokenBalance={this.state.peceiptTokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.peceiptuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
