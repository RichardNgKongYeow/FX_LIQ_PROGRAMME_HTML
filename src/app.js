import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import StakeForm from './components/StakeForm';
import UnstakeForm from './components/UnstakeForm';
import TransferOwnership from './components/Index';
import Owner from './components/Owner';
import Navbar from './components/Navbar';
// import Login from './components/login';
import "bootstrap/dist/css/bootstrap.min.css";
import './app.css';

const App = () => {

  return (
    <div>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path='/Home' component={Home} />
          <Route path='/StakeForm' exact component={StakeForm} />
          <Route path='/UnstakeForm' exact component={UnstakeForm} />
          <Route path='/TransferOwnership' exact component={TransferOwnership} />
          <Route path='/Owner' exact component={Owner} />
          {/* <Route path='/login' exact component={Login} />         */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
