import React from "react";
import { io } from 'socket.io-client';

import "./ChatRoom.css";

export default class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        const queryParameters = new URLSearchParams(window.location.search)
        this.user = queryParameters.get("user");
        this.serv = queryParameters.get("serv");
        this.state = { user: this.user, 
                       serv: this.serv, 
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
        var socket = io.connect('http://localhost:28000', { transports : ['websocket', 'polling', 'flashsocket'] });
        console.log('Client handshake with login server');
        socket.emit('data', `${this.user} ${this.serv}`);

        // Server returns port number of correct server to call (28001-28065)
        socket.on('data', (data) => {
            serverPort = data;
            console.log(`Client told to use port ${serverPort}`);
            console.log('Client-Server handshake ended');
            socket.close();

            // Setup socket for chat communication
            socket = io.connect('http://localhost:'+serverPort, { transports : ['websocket', 'polling', 'flashsocket'] });
            console.log('Client connected with server at port',serverPort);
            socket.emit('uuid', `${this.user}`);
            socket.on('data', (data) => {
                console.log('Received message', data);
                this.state.hist.push(data.split(','));
                this.forceUpdate();
            });
            socket.on('error', (err) => {
                console.log(err);
            });
            socket.on('disconnect', function() {
                console.log('Client disconnected');
            });
            this.setState({ socket: socket });
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
            console.log(`Send message ${[datetime, this.state.user, this.state.msg].join(',')} to server`);
            this.state.socket.emit('data', [datetime, this.state.user, this.state.msg].join(','));
            this.setState({ msg: '' });
        }
    };

    componentDidMount() {
        window.onbeforeunload = function() {
           this.state.socket.close();
        };
    }
    
    componentWillUnmount() {
        this.state.socket.close();
    }

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