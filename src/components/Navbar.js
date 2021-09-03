import React, { Component } from 'react'
import fx_token from '../fx_token.png'
import Identicon from 'identicon.js';

import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavMenu'

class Navbar extends Component {
  render() {
      return (
        <Nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://www.pundix.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={fx_token} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Trading Wallet
        </a>


        <NavLink to='/'>
  
            </NavLink>
              <Bars />
              <NavBtn>
                    <NavBtnLink to='/StakeForm'>STAKE!</NavBtnLink>
                </NavBtn>
            {/* <NavMenu>
              <NavLink to='/dashboard' activeStyle>
                  Mkt Dashboard
              </NavLink>
              <NavLink to='/tradenow' activeStyle>
                  Trade Now
              </NavLink>
              <NavLink to='/about' activeStyle>
                  About the team
              </NavLink>
              <NavLink to='/signup' activeStyle>
                  Sign Up
              </NavLink>       
            </NavMenu> */}
                <NavBtn>
                    <NavBtnLink to='/login'>UN-STAKE...</NavBtnLink>
                </NavBtn>

                <NavBtn>
                    <NavBtnLink to='/login'>Transfer Ownership</NavBtnLink>
                </NavBtn>
                <NavBtn>
                    <NavBtnLink to='/login'>Owner Functions</NavBtnLink>
                </NavBtn>

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
      </Nav>

      );
   
  }
}

export default Navbar;
