import React, { Component } from "react";
import Header from "./Header";
import Player from "./Player";
import AddPlayerForm from "./AddPlayerForm";
import Campaign from "./Campaign";
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //players route
            players: [],
            prevPlayerId: 0,
            //sql route
            campaigns: [],
            campaignId: ""
        };

        this.handleAddPlayer = this.handleAddPlayer.bind(this);
    }

    componentDidMount() {
        let players = this.state.players;
        //players route
        fetch("http://localhost:3001/players")
            .then(p => {
                return p.json();
            })
            .then(players => {
                let prevPlayerId;
                if (!players.length) {
                    prevPlayerId = 0;
                } else {
                    prevPlayerId = players[players.length - 1].id;
                }
                this.setState({
                    players,
                    prevPlayerId,
                    blueberry: "blueberry"
                });
            });

        fetch("http://localhost:3001/dcm/networks", { credentials: "include" })
            .then(p => {
                return p.json();
            })
            .then(campaigns => {
                this.setState({
                    campaigns
                });
            })
            .catch(e => {
                console.log(e);
            });
    }
    handleScoreChange = (index, delta) => {
        // this.setState(prevState => ({
        //     score: (prevState.players[index].score += delta)
        // }));
        let currentPlayer = this.state.players[index];

        //ask bobby about this

        if (delta === 1) {
            fetch(
                `http://localhost:3001/players/${currentPlayer.id}/increment`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(currentPlayer)
                }
            )
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    this.setState(prevState => {
                        return {
                            players: response
                            // prevPlayerId: prevState.prevPlayerScore + 1
                        };
                    });
                });
        } else {
            fetch(
                `http://localhost:3001/players/${currentPlayer.id}/decrement`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(currentPlayer)
                }
            )
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    this.setState(prevState => {
                        return {
                            players: response
                            // prevPlayerId: prevState.prevPlayerScore + 1
                        };
                    });
                });
        }
    };

    handleAddPlayer = name => {
        let { prevPlayerId } = this.state;
        let newPlayer = {
            name,
            id: (prevPlayerId += 1),
            score: 0
        };

        fetch("http://localhost:3001/players", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPlayer)
        })
            .then(response => {
                return response.json();
            })
            .then(response => {
                this.setState(prevState => {
                    return {
                        players: response,
                        prevPlayerId: prevState.prevPlayerId + 1
                    };
                });
            });
        // this.setState(prevState => {
        //     return {
        //         players: [
        //             ...prevState.players,
        //
        //         ]
        //     };
        // });
    };

    handleRemovePlayer = id => {
        // this.setState(prevState => {
        //     return {
        //         players: prevState.players.filter(p => p.id !== id)
        //     };
        // });
        let currentPlayer = this.state.players.find(p => p.id === id);

        // for (let i = 0; i < players.length; i++) {
        //     let p = players[i];
        // }

        fetch(`http://localhost:3001/players/${currentPlayer.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentPlayer)
        })
            .then(response => {
                return response.json();
            })
            .then(response => {
                this.setState(prevState => {
                    return {
                        players: response
                        // prevPlayerId: prevState.prevPlayerScore + 1
                    };
                });
            });
    };

    render() {
        return (
            <div className="scoreboard">
                <Header title="Scoreboard" players={this.state.players} />
                {/* Players list */}

                {this.state.players.map((player, index) => (
                    <Player
                        name={player.name}
                        score={player.score}
                        id={player.id}
                        key={player.id.toString()}
                        index={index}
                        changeScore={this.handleScoreChange}
                        removePlayer={this.handleRemovePlayer}
                    />
                ))}
                <AddPlayerForm addPlayer={this.handleAddPlayer} />
                {this.state.campaigns.length > 0
                    ? this.state.campaigns.map(campaign => (
                          <Campaign
                              name={campaign.name}
                              campaignId={campaign.Id}
                          />
                      ))
                    : null}
            </div>
        );
    }
}

export default App;
