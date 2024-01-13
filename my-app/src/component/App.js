import React from "react";
import LoginPanel from "./LoginPanel"
import logo from '../logo.svg';
import './App.css';

export default class App extends React.Component {
  render() {
    return (
      <div className="component-app">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <LoginPanel/>
        </header>
      </div>
    )
  }
};
