import React, { Component } from 'react'
import fx_token from '../fx_token.png'
import Identicon from 'identicon.js';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink0,
  NavBtnLink1,
  NavBtnLink2,
} from './NavMenu'


class Navbar extends Component {
  render() {
      return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://www.pundix.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={fx_token} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Trading Wallet
        </a>
        <NavBtnLink0 to='/Stake' activeStyle>
                  Stake
              </NavBtnLink0>
              <NavBtnLink1 to='/Unstake' activeStyle>
                  Unstake
              </NavBtnLink1>
              <NavBtnLink2 to='/Owner' activeStyle>
                  Owner
              </NavBtnLink2>
          <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{this.props.account}</small>
            </small>
          
            { this.props.account
              ? <img
                className="ml-2"
                width='30'
                height='30'
                src={`data:image/png;base64,${new Identicon(this.props.account).toString()}`}
                alt=""
              />
              : <span></span>
            }
          </li>
        </ul>
      </nav>

      );
   
  }
}

export default Navbar;
