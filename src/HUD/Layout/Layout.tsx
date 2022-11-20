import React from "react";
import TeamBox from "./../Players/TeamBox";
import MatchBar from "../MatchBar/MatchBar";
import RoundHistory from "../MatchBar/RoundHistory";
import SeriesBox from "../MatchBar/SeriesBox";
import Observed from "./../Players/Observed";
import { CSGO, Team } from "csgogsi-socket";
import { Match } from "../../api/interfaces";
import RadarMaps from "./../Radar/RadarMaps";
import SideBox from '../SideBoxes/SideBox';
import { GSI, actions } from "./../../App";
import MoneyBox from '../SideBoxes/Money';
import Killfeed from "../Killfeed/Killfeed";
import MapSeries from "../MapSeries/MapSeries";
import Overview from "../Overview/Overview";
import Pause from "../PauseTimeout/Pause";
import Timeout from "../PauseTimeout/Timeout";
import TournamentName from "../TournamentName/Tournament";
import PlayerCamera from "../Camera/Camera";
import UtilityLevel from '../SideBoxes/UtilityLevel';
import Utility from '../SideBoxes/Utility'
import LogoMatchbar from '../../assets/TampeleBali.png'
// import "./layout.scss"


interface Props {
  game: CSGO,
  match: Match | null
}

interface State {
  showWin: boolean,
  forceHide: boolean,
}

export default class Layout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showWin: false,
      forceHide: false,
    }
  }

  componentDidMount() {
    GSI.on('freezetimeStart', () => {
      setTimeout(() => {        
        this.setState({ showWin: true }, () => {
          setTimeout(() => {
            this.setState({ showWin: false })
          }, 4000)
        });
      }, 20000);

    });
    actions.on("boxesState", (state: string) => {
      if (state === "show") {
        this.setState({ forceHide: false });
      } else if (state === "hide") {
        this.setState({ forceHide: true });
      }
    });
  }

  getVeto = () => {
    const { game, match } = this.props;
    const { map } = game;
    if (!match) return null;
    const mapName = map.name.substring(map.name.lastIndexOf('/') + 1);
    const veto = match.vetos.find(veto => veto.mapName === mapName);
    if (!veto) return null;
    return veto;
  }

  

  render() {
    const { game, match } = this.props;
    const left = game.map.team_ct.orientation === "left" ? game.map.team_ct : game.map.team_t;
    const right = game.map.team_ct.orientation === "left" ? game.map.team_t : game.map.team_ct;

    const leftPlayers = game.players.filter(player => player.team.side === left.side);
    const rightPlayers = game.players.filter(player => player.team.side === right.side);
    const isFreezetime = (game.round && game.round.phase === "freezetime") || game.phase_countdowns.phase === "freezetime";
    const isOvertime = (game.round && game.round.phase === "over") || game.phase_countdowns.phase === "over";
    const { forceHide, showWin } = this.state;
    const round = game.map.rounds


    return (
      <div className="layout">
        <div className={`players_alive ${isFreezetime ? 'hide':''}`}>
          <div className="title_container">Players alive</div>
          <div className="counter_container">
            <div className={`team_counter1 ${left.side}`}>{leftPlayers.filter(player => player.state.health > 0).length}</div>
            <div className={`vs_counter`}>VS</div>
            <div className={`team_counter2 ${right.side}`}>{rightPlayers.filter(player => player.state.health > 0).length}</div>
          </div>
        </div>
        <Killfeed />
        <Overview match={match} map={game.map} players={game.players || []} />
        <RadarMaps match={match} map={game.map} game={game} />
        {
          !(isFreezetime && !forceHide && round.length > 15) && 
          <MatchBar map={game.map} phase={game.phase_countdowns} bomb={game.bomb} match={match} />
        }
        {
          (isFreezetime && !forceHide && round.length > 15) &&
          <RoundHistory map={game.map}/>
        }
        <Pause  phase={game.phase_countdowns}/>
        <Timeout map={game.map} phase={game.phase_countdowns} />
        {
          !(isFreezetime && !forceHide && round.length > 15) &&
          <SeriesBox map={game.map} phase={game.phase_countdowns} match={match} />
        }

 
        <Observed player={game.player} veto={this.getVeto()} round={game.map.round+1}/>

        <TeamBox team={left} players={leftPlayers} side="left" current={game.player} isFreezetime={isFreezetime} />
        <TeamBox team={right} players={rightPlayers} side="right" current={game.player} isFreezetime={isFreezetime} />

        {
          !(isFreezetime && !forceHide && round.length > 15) &&
          <TournamentName />
        }

        {
          !(isFreezetime && !forceHide && round.length > 15) &&
           <div className="logoMatchBar">
             <img src={LogoMatchbar} width={40} height={40}/>
           </div>
        }

        <MapSeries teams={[left, right]} match={match} isFreezetime={isFreezetime} map={game.map} />
        <div className={"boxes left"}>
          <Utility side={left.side} players={game.players} show={showWin && !forceHide} />
          <UtilityLevel side={left.side} players={game.players} show={isFreezetime && !forceHide} />
          <MoneyBox
            team={left.side}
            side="left"
            loss={Math.min(left.consecutive_round_losses * 500 + 1400, 3400)}
            equipment={leftPlayers.map(player => player.state.equip_value).reduce((pre, now) => pre + now, 0)}
            money={leftPlayers.map(player => player.state.money).reduce((pre, now) => pre + now, 0)}
            show={isFreezetime && !forceHide} 
          />
          <SideBox side="left" hide={forceHide} />
        </div>
        <div className={"boxes right"}>
          <Utility side={right.side} players={game.players} show={showWin && !forceHide} />
          <UtilityLevel side={right.side} players={game.players} show={isFreezetime && !forceHide} />
          <MoneyBox
            team={right.side}
            side="right"
            loss={Math.min(right.consecutive_round_losses * 500 + 1400, 3400)}
            equipment={rightPlayers.map(player => player.state.equip_value).reduce((pre, now) => pre + now, 0)}
            money={rightPlayers.map(player => player.state.money).reduce((pre, now) => pre + now, 0)}
            show={isFreezetime && !forceHide}
          />
          <SideBox side="right" hide={forceHide} />
        </div> 
      </div>
    );
  }
} 

