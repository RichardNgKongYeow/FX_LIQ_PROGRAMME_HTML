import React, { Component } from 'react'
import dai from '../tether.png'
// import ButtonGroup from 'react-bootstrap/ButtonGroup'
// import Button from '@material-ui/core/Button';

class Stake extends Component {

  render() {
    return (
      <div id="content" className="mt-3">
          {/* <div className="text-center">
            <ButtonGroup>
                <Button variant="contained" color="default" component={Link} to="/PRTokenDistribution/">Liquidity Pool</Button>
                <Button variant="outlined" color="default" component={Link} to="/PRTokenDistribution/NPXSXEMigration/">Migrate NPXSXEM</Button>
                <Button variant="outlined" color="default" component={Link} to="/PRTokenDistribution/PurseDistribution/">Purse Distribution</Button>
            </ButtonGroup>
        </div> */}
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              {/* <th scope="col">mUSDT Staked</th> */}
              <th scope="col">Receipt Token Balance</th>
              <th scope="col">Staking timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mUSDT</td> */}
              <td>{window.web3.utils.fromWei(this.props.peceiptTokenBalance, 'Ether')} PFX</td>
              <td>{new Date((this.props.stakerInfo.stakingTimestamp)*1000).toLocaleDateString("en-US")}</td>

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
          </div>
          
        </div>
        <label className="center"><b>Pool Info</b></label>
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Total Tether Staked In Pool</th>
              <th scope="col">Total Receipt Token In Ciculation</th>
              <th scope="col">Lock In Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.farmInfo.tetherSupply, 'Ether')} mUSDT</td>
              <td>{window.web3.utils.fromWei(this.props.farmInfo.peceiptInCirculation, 'Ether')} PFX</td>
              <td>20 Days</td>

            </tr>
          </tbody>
        </table>
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>

              <th scope="col">1 mUSDT = </th>
              <th scope="col">1 PFX = </th>
              <th scope="col">Tether Tokens In Contract</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              
              <td>{(this.props.farmInfo.peceiptInCirculation/this.props.farmInfo.tetherSupply)} PFX</td>
              <td>{(this.props.farmInfo.tetherSupply/this.props.farmInfo.peceiptInCirculation)} mUSDT</td>
              <td>{window.web3.utils.fromWei(this.props.tetherTokenInContract, 'Ether')} mUSDT</td>
            </tr>
          </tbody>
        </table>
              
      </div>
      
    );
  }
}

export default Stake;
