import React from "react";
import logo from '../logo.svg';
import { Link } from 'react-router-dom'

import "./LoginPanel.css";

export default class LoginPanel extends React.Component {
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
            alert('To,');
        }
    };

    render() {
        return (
            <div className="component-app">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <div className="component-login-panel">
                        <h2> Login to Chatroom </h2>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" onChange={(e) => this.handleChange(e,"user")} value={this.state.user} placeholder="username" />
                            <input type="text" onChange={(e) => this.handleChange(e,"serv")} value={this.state.serv} placeholder="server" />
                            <Link to={`/chat?user=${this.state.user}&serv=${this.state.serv}`}>
                                <button type="submit">Login</button>
                            </Link>
                        </form>
                    </div>
                </header>
            </div>
        );
    }
}