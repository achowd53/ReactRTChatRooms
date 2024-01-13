import React from "react";

import "./ChatRoom.css";

export default class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user: '', serv: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, state) {
        if (state === "user") {
            this.setState({ user : event.target.value });
        } else {
            this.setState({ serv : event.target.value });
        }
    };

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.user !== '' && this.state.serv !== '') {
            return (
                <div className="component-app">
                    <ChatRoom/>
                </div>
            )
        }
    };

    render() {
        return (
            <div className="component-login-panel">
                <h2> Login to Chatroom </h2>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" onChange={(e) => this.handleChange(e,"user")} value={this.state.user} placeholder="username" />
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
}