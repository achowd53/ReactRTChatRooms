import React from "react";
import { io } from 'socket.io-client';

import "./ChatRoom.css";

export default class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        const queryParameters = new URLSearchParams(window.location.search)
        this.state = { user: queryParameters.get("user"), 
                       serv: queryParameters.get("serv"), 
                       hist: [],
                       msg: '',
                       socket: io() };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.generateHistory = this.generateHistory.bind(this);
        this.setupClient();
    }

    setupClient() {
        // Initial handshake with login server 28000 to confirm identity of client
        var serverPort = 28000;
        var socket = io('http://localhost:28000');
        socket.on('connection', function() {
            console.log('Client handshake with login server');
            socket.emit('connection', `${this.state.user} ${this.state.serv}`);
        });

        // Server returns port number of correct server to call (28001-28065)
        socket.on('data', (data) => {
            serverPort = data;
            socket.close();
        });

        // Setup socket for chat communication
        this.setState({ socket: io('http://localhost:'+serverPort) });
        this.state.socket.on('data', (data) => {
            console.log('Received message');
            this.state.hist.push(data.split(' '));
        });
        this.state.socket.on('error', (err) => {
            console.log(err);
        });
        this.state.socket.on('end', function() {
            console.log('Client disconnected');
        });

    };

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
        if (this.state.msg !== '') {
            var datetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            console.log(`Send message ${[datetime, this.state.user, this.state.msg].join(' ')} to server`);
            this.state.socket.emit('data', [datetime, this.state.user, this.state.msg].join(' '));
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