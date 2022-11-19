import React from "react";
import * as I from "csgogsi-socket";
import "./matchbar.scss";
import TeamLogo from './TeamLogo';

interface IProps {
    map: any;
}

interface IState {
    capacity: any,
    round: any
}

export default class RoundHistory extends React.Component<IProps, IState> {
    constructor(props: IProps){
        super(props);
        this.state = {
            capacity : 15,
            round: [0, 4, 9, 14, 15, 19, 24, 29]
        }
      }

    render() {
        const { capacity, round } = this.state
        const { map } = this.props;
        const left = map.team_ct.orientation === "left" ? map.team_ct : map.team_t;
        const right = map.team_ct.orientation === "left" ? map.team_t : map.team_ct;
        // map?.rounds.filter((items : any, index : number) => {
        //     if (items.round < 16) {
        //         return items
        //     }
        //     if (items.round > 16) {
        //         return items
        //     }
        // })
        const lengthRound = map?.rounds.length
        let result = lengthRound - capacity
        if (lengthRound > capacity) {
            for (let i = 0; i < result; i++) {
                map?.rounds?.shift()
            }
        } else {
            result = result * -1
            for (let i = 0; i < result; i++) {
                if (i === 0) {            
                    map?.rounds.push({
                        "team": {},
                        "round": lengthRound + 1,
                        "side": "playing",
                        "outcome": ""
                    })
                } else {
                    map?.rounds.push({
                        "team": {},
                        "round": lengthRound + i + 1,
                        "side": "",
                        "outcome": ""
                    })
                }
            }
        }

        return (
            <>
                <div id="round-history">
                    <div className={`team-name-history`}>{left.name}</div>
                    <div className="round-history-bg">
                        <div className="grid-1">
                            <div className="column-1">
                                <TeamLogo team={left} width={20} height={20}/>
                                <TeamLogo team={right} width={20} height={20}/>
                            </div>
                            <div className="column-2">
                                <div>{left.score}</div>
                                <div>{right.score}</div>
                            </div>
                            <div className="column-3">
                                {
                                    ['CT', 'T'].map((team, index) => (               
                                        <div key={index} className="container-round">
                                            {
                                                map?.rounds?.map((round : any, index : any) => {
                                                    if (round.side == "playing") {
                                                        return (
                                                            <div key={index} className="rounds">
                                                                <div className={`round playing`}/>
                                                            </div>
                                                        )
                                                    } else {
                                                        return (
                                                            <div className="rounds" key={index}>
                                                                <div className={`round ${round.side == team ? `win ${round.side}` : "" }`}/>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="grid-2">
                            <div style={{ flex: 1 }}/>
                            <div style={{ flex: 5, display: 'flex' }}>
                                {
                                    map?.rounds?.map((items : any, index : any) => (
                                        <div className="number_round" key={index}>
                                            {
                                                round.includes(index) &&
                                                <label key={index}>{items?.round}</label>
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="grid-3">
                            <label>ROUND HISTORY</label>
                        </div>
                    </div>
                    <div className={`team-name-history`}>{right.name}</div>
                </div>
            </>
        )
    }
}