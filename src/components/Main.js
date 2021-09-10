import React, { Component } from 'react'


class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">

        

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

export default Main;
