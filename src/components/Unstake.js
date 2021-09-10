import React, { Component } from 'react'
import PFX from '../fx_token.png'
// import ButtonGroup from 'react-bootstrap/ButtonGroup'
// import Button from '@material-ui/core/Button';

class Unstake extends Component {

  render() {
    return (
      <div id="content" className="mt-3">

        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              {/* <th scope="col">mUSDT Staked</th> */}
              <th scope="col">Tether Token Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mUSDT</td> */}
              <td>{window.web3.utils.fromWei(this.props.tetherTokenBalance, 'Ether')} mUSDT</td>

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
                this.props.unstakeTokens(amount)
              }}>
              <div>
                <label className="float-left"><b>Unstake Tokens</b></label>
                <span className="float-right text-muted">
                  PFX Balance: {window.web3.utils.fromWei(this.props.peceiptTokenBalance, 'Ether')}
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
                    <img src={PFX} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; PFX
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">UNSTAKE...</button>
            </form>
  
          </div>
          
        </div>
        <label className="center"><b>Pool Info</b></label>
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Total Tether Staked In Pool</th>
              <th scope="col">Total Receipt Token In Ciculation</th>
              <th scope="col">Total Tether In Fees Pool</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.mUSDTpool, 'Ether')} mUSDT</td>
              <td>{window.web3.utils.fromWei(this.props.PFXincirculation, 'Ether')} PFX</td>
              <td>{window.web3.utils.fromWei(this.props.mUSDTfees, 'Ether')} mUSDT</td>


            </tr>
          </tbody>
        </table>
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>

              <th scope="col">1 mUSDT = </th>
              <th scope="col">1 PFX = </th>
              <th scope="col">Staking Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              
              <td>{window.web3.utils.fromWei(this.props.PFXtomUSDT, 'Ether')} PFX</td>
              <td>{window.web3.utils.fromWei(this.props.mUSDTtoPFX, 'Ether')} mUSDT</td>
              <td>{this.props.stakingFee} %</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    );
  }
}

export default Unstake;
