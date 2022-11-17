import React from "react";
import * as I from "csgogsi-socket";
import "./matchbar.scss";
import TeamLogo from './TeamLogo';

interface IProps {
    map: I.Map;
}

interface IState {
    capacity: any
}

export default class RoundHistory extends React.Component<IProps, IState> {
    constructor(props: IProps){
        super(props);
        this.state = {
            capacity : 15
        }
      }

    render() {
        const { capacity } = this.state
        const { map } = this.props;
        const left = map.team_ct.orientation === "left" ? map.team_ct : map.team_t;
        const right = map.team_ct.orientation === "left" ? map.team_t : map.team_ct;
        const lengthRound = map?.rounds.length
        if (lengthRound > capacity) {
            let result = lengthRound - capacity
            for (let i = 0; i < result; i++) {
                map?.rounds?.shift()
            }
        }

        
        return (
            <>
                <div id="round-history">
                    <div className={`team-name-history`}>{left.name}</div>
                    <div className="round-history-bg">
                        <div className="grid-1">
                            <div className="column-1">
                                <TeamLogo team={left} width={25} height={25}/>
                                <TeamLogo team={right} width={25} height={25}/>
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
                                                map?.rounds?.map((round, index) => (
                                                    <div className="rounds">
                                                        <div key={index} className={`round ${round.side == team ? `win ${round.side}` : "" }`}/>
                                                    </div>
                                                ))
                                            }
                                            <div className="rounds">
                                                <div className={`round playing`}/>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="grid-2">
                            <label>ROUND HISTORY</label>
                        </div>
                    </div>
                    <div className={`team-name-history`}>{right.name}</div>
                </div>
            </>
        )
    }
}