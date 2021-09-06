import React, { Component } from 'react'
// import dai from '../tether.png'
// import ButtonGroup from 'react-bootstrap/ButtonGroup'
// import Button from '@material-ui/core/Button';

class Main extends Component {

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

export default Main;
