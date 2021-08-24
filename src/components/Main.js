import React, { Component } from 'react'
import dai from '../tether.png'

class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">

        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">mUSDT Staked</th>
              <th scope="col">Receipt Token Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mUSDT</td>
              <td>{window.web3.utils.fromWei(this.props.peceiptTokenBalance, 'Ether')} PFX</td>
            </tr>
          </tbody>
        </table>
        

        <div className="card mb-4" >

          <div className="card-body">

            <form className="mb-3" onSubmit={(event) => {
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                amount = window.web3.utils.toWei(amount, 'Ether')
                this.props.stakeTokens(amount)
              }}>
              <div>
                <label className="float-left"><b>Stake Tokens</b></label>
                <span className="float-right text-muted">
                  mUSDT Balance: {window.web3.utils.fromWei(this.props.tetherTokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input) => { this.input = input }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dai} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; mUSDT
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
            </form>
            <button
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                amount = window.web3.utils.toWei(amount, 'Ether')
                this.props.unstakeTokens(amount)
              }}>
                UN-STAKE...
              </button>

              
          </div>
          
        </div>
        <label className="center"><b>Pool Info</b></label>
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Total Tether Staked In Pool</th>
              <th scope="col">Total Peceipt Token In Ciculation</th>
              <th scope="col">Exchange rate PFX/mUSDT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.farmInfo.tetherSupply, 'Ether')} mUSDT</td>
              <td>{window.web3.utils.fromWei(this.props.farmInfo.peceiptInCirculation, 'Ether')} PFX</td>
              <td>{(this.props.farmInfo.peceiptInCirculation/this.props.farmInfo.tetherSupply)} PFX/mUSDT</td>
            </tr>
          </tbody>
        </table>

        <button
              type="submit"
              className="btn btn-link btn-block btn-sm bet_time"
              onClick={(event) => {
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                amount = window.web3.utils.toWei(amount, 'Ether')
                this.props.withdrawTether(amount)
              }}>
                Withdraw Tether
              </button>
      </div>
      
    );
  }
}

export default Main;
