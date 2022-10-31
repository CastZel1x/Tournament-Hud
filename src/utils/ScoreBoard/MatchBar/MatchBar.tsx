import React from "react";
import * as I from "csgogsi-socket";
import "./matchbar.scss";
import TeamScore from "./TeamScore";
import { GSI } from "../../../App";
import { Match } from "../../../api/interfaces";



interface IProps {
  match: Match | null;
  map: I.Map;
  phase: I.PhaseRaw,
  bomb: I.Bomb | null,
}

export interface Timer {
  width: number;
  active: boolean;
  countdown: number;
  side: "left"|"right";
  type: "defusing" | "planting";
  player: I.Player | null;
}

interface IState {
  defusing: Timer,
  planting: Timer,
  winState: {
    side: "left"|"right",
    show: boolean
  }
}

export default class TeamBox extends React.Component<IProps, IState> {
  constructor(props: IProps){
    super(props);
    this.state = {
      defusing: {
        width: 0,
        active: false,
        countdown: 10,
        side: "left",
        type: "defusing",
        player: null
      },
      planting: {
        width: 0,
        active: false,
        countdown: 10, // Fake
        side: "right",
        type: "planting",
        player: null
      },
      winState: {
        side: 'left',
        show: false
      }
    }
  }


  resetWin = () => {
    setTimeout(() => {
      this.setState(state => {
        state.winState.show = false;
        return state;
      })
    }, 6000);
  }

  componentDidMount(){
    GSI.on("roundEnd", score => {
      this.setState(state => {
        state.winState.show = true;
        state.winState.side = score.winner.orientation;
        return state;
      }, this.resetWin);
    });
  }
  getRoundLabel = () => {
    const { map } = this.props;
    const round = map.round + 1;
    if (round <= 30) {
      return `Round ${round}/30`;
    }
    const additionalRounds = round - 30;
    const OT = Math.ceil(additionalRounds/6);
    return `OT ${OT} (${additionalRounds - (OT - 1)*6}/6)`;
  }
  render() {
    const { defusing, planting, winState } = this.state;
    const { map} = this.props;
    const left = map.team_ct.orientation === "left" ? map.team_ct : map.team_t;
    const right = map.team_ct.orientation === "left" ? map.team_t : map.team_ct;
    let leftTimer: Timer | null = null, rightTimer: Timer | null = null;
    if(defusing.active || planting.active){
      if(defusing.active){
        if(defusing.side === "left") leftTimer = defusing;
        else rightTimer = defusing;
      } else {
        if(planting.side === "left") leftTimer = planting;
        else rightTimer = planting;
      }
    }
    return (
      <>
        <div id={`matchbar`}>
          <TeamScore team={left} orientation={"left"} timer={leftTimer} showWin={winState.show && winState.side === "left"} />
          <div className="border">
          <div className="b"></div>
          <div className="b"></div>
          </div>
          <div className={`score left ${left.side}`}>{left.score}<div className="score-">-</div></div>
          <div className={`score right ${right.side}`}>{right.score}</div>
          <TeamScore team={right} orientation={"right"} timer={rightTimer} showWin={winState.show && winState.side === "right"} />
        </div>
      </>
    );
  }
}