import React, { Component} from "react";
import io from "socket.io-client";
import fetch from "isomorphic-fetch";
import RankBoard from "../containers/rankboard";
import Gamestat from "../containers/gamestatus";
import { Container, Row, Col } from "reactstrap";
import InitState from "../containers/InitState";
import Login from '../containers/login'
import Cookies from 'js-cookie'

// import {wrapper} from '../store';

//fetch data from the server
// export const getStaticProps = wrapper.getStaticProps(store => async ({ req }) => {
//     const response = await fetch("http://localhost:3000/game_info");
//     const data = await response.json();
//     // store.dispatch({type: 'setIp', payload: data.ip})
//     // console.log(store.getState())
//     console.log('dtat',data);
//     return {props:data};
// })

class HomePage extends Component {
    static async getInitialProps({ req }) {
        let token = ''
        try{
            console.log(req.headers.cookie)
            const res = await fetch('http://localhost:3000/ta/isLogin',{headers:{cookie:req.headers.cookie}})
            if(res.ok) {
                token = await res.json().token
            }
        }catch{}
        const response = await fetch("http://localhost:3000/game_info");
        const data = await response.json();
        return {...data,token};
    }
    static defaultProps = {
        time_remain: 120,
        current_team: "Nobody",
        status: {
            gamemode: null,
            point: 0,
            current_sequence_index: 0,
            last_eaten_time: 0,
        },
        GAME_TIME: 120,
        history: {},
    };

    // init state with the prefetched messages
    state = {
        time_remain: this.props.time_remaining,
        current_team: this.props.current_team,
        status: this.props.status,
        history: this.props.history,
        GAME_TIME: this.props.GAME_TIME,
    };

    // connect to WS server and listen event
    componentDidMount() {
        this.socket = io();
        // Timer
        if (this.state.time_remain != this.state.GAME_TIME) {
            this.timer = setInterval(() =>
                this.setState((state) => {
                    if (state.time_remain > 0)
                        return {
                            time_remain: state.time_remain - 1,
                        };
                    else {
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                }),
                1000
            );
        }
        // game events
        this.socket.on("game_started", (data) => {
            console.log("game started");
            this.setState((state) => ({
                current_team: data.current_team,
                status: { ...state.status, gamemode: data.gamemode },
            }));
            this.timer = setInterval(
                () =>
                    this.setState((state) => {
                        if (state.time_remain > 0)
                            return {
                                time_remain: state.time_remain - 1,
                            };
                        else {
                            clearInterval(this.timer);
                            this.timer = null;
                        }
                    }),
                1000
            );
        });
        this.socket.on("update_time", (data) => {
            console.log("update time");
            this.setState(() => ({ time_remain: data.time_remain }));
        });
        this.socket.on("UID_added", (data) => {
            console.log("UID_added");
            this.setState((state) => ({
                status: { ...state.status, point: data.point },
            }));
        });
        this.socket.on("game_end", (data) => {
            console.log("game ended");
            clearInterval(this.timer);
            this.timer = null;
            this.setState((state) => {
                return {
                    time_remain: state.GAME_TIME,
                    history: {
                        ...state.history,
                        [`${data.gamemode}`]: data.history,
                    },
                    status: {
                        gamemode: null,
                        point: 0,
                        current_sequence_index: 0,
                        last_eaten_time: 0,
                    },
                    current_team: "Nobody",
                };
            });
        });
        // modify score events (TA functions)
        this.socket.on("modify_current_score", (data) => {
            console.log("Score modified");
            this.setState((state) => ({
                status: {...state.status, point: data.point},
            }));
        });
        this.socket.on("modify_history_score", (data) => {
            console.log("Score modified");
            this.setState((state) => ({
                history: {
                    ...state.history,
                    [`0`]: data.history,
                },
            }));
        });
    }

    // close socket connection
    componentWillUnmount() {
        this.socket.close();
    }

    // // add messages from server to the state
    // handleMessage = (message) => {
    //     this.setState((state) => ({
    //         messages: state.messages.concat(message),
    //     }));
    // };

    // handleChange = (event) => {
    //     this.setState({ field: event.target.value });
    // };

    // // send messages to server and add them to the state
    // handleSubmit = (event) => {
    //     event.preventDefault();

    //     // create message object
    //     const message = {
    //         id: new Date().getTime(),
    //         value: this.state.field,
    //     };

    //     // send object to WS server
    //     this.socket.emit("message", message);

    //     // add it to state and clean current input value
    //     this.setState((state) => ({
    //         field: "",
    //         messages: state.messages.concat(message),
    //     }));
    // };

    render() {
        return (
            <div className="all">
                <div className="title">
                    <h1>109-2 電資工程入門設計與實作 指定題</h1>
                </div>
                <div className="subtitle">
                    <h3 style={{"marginRight":"100px","marginLeft":"200px"}}>{this.props.ip}</h3>
                    <Login style={{'float':'right'}}/>
                    <InitState ip={this.props.ip} token={this.props.token}/>
                </div>
                <div className="body">
                    <div className="right">
                        <RankBoard history={this.state.history}/>
                    </div>
                    <div className="left">
                        <Gamestat game_info={this.state} socket={this.socket}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;