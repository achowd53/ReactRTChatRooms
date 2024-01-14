import React from "react";

import "./ChatRoom.css";

export default class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        const queryParameters = new URLSearchParams(window.location.search)
        this.state = { user: queryParameters.get("user"), 
                       serv: queryParameters.get("serv"), 
                       hist: [],
                       msg: '' };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.generateHistory = this.generateHistory.bind(this);
    }

    generateHistory() {
        return (
            <table>
                <tbody>
                    {this.state.hist.map((row) => (
                        <tr>
                            {row.map((val, colId) => (
                                <td id={colId}>{val}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };
    
    handleChange(event) {
        this.setState({ msg : event.target.value });
    };

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.msg != '') {
            var datetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            this.state.hist.push([datetime, this.state.user, this.state.msg]);
            this.setState({ msg: '' });
        }
    };

    render() {
        return (
            <div className="component-chatroom-panel">
                <h2> Logged in as user {this.state.user} in server {this.state.serv} </h2>
                <div className="chatroom-history">
                    {this.generateHistory()}
                </div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" onChange={this.handleChange} value={this.state.msg} placeholder="message" />
                    <button type="submit">Send</button>
                </form>
            </div>
        );
    }
}