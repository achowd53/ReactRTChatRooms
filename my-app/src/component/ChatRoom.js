import React from "react";

import "./ChatRoom.css";

export default class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = buttonName => {
    console.log("pogchamp login 2");
  };

  render() {
    return (
      <div className="component-chatroom">
        <h2> Login to Chatroom </h2>
        <form>
            <input type="text" placeholder="username" />
            <input type="text" placeholder="server" />
            <button type="submit" onClick={this.handleClick}>Login</button>
        </form>
      </div>
    );
  }
}