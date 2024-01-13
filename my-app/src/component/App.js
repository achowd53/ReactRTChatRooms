import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPanel from "./LoginPanel"
import ChatRoom from "./ChatRoom";

import './App.css';

export default class App extends React.Component {
  render() {
    return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <LoginPanel/> } />
            <Route path="/chat" element={ <ChatRoom/> } />
          </Routes>
        </BrowserRouter>
      )
  }
};
