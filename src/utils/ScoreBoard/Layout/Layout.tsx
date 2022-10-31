import React from "react";
import TeamBox from "./../Players/TeamBox";
import MatchBar from "../MatchBar/MatchBar";
import { CSGO, Team } from "csgogsi-socket";
import { Match } from "../../../api/interfaces";
import { GSI, actions } from "../../../App";
import TournamentName from "../TournamentName/Tournament";

interface Props {
  game: CSGO,
  match: Match | null
}

interface State {
  winner: Team | null,
  showWin: boolean,
  forceHide: boolean
}

export default class ScoreBoard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      winner: null,
      showWin: false,
      forceHide: false
    }
  }

  componentDidMount() {
    GSI.on('roundEnd', score => {
      this.setState({ winner: score.winner, showWin: true }, () => {
        setTimeout(() => {
          this.setState({ showWin: false })
        }, 4000)
      });
    });
    actions.on("boxesState", (state: string) => {
      if (state === "show") {
        this.setState({ forceHide: false });
      } else if (state === "hide") {
        this.setState({ forceHide: true });
      }
    });
    actions.on("scoreboardState", (state: string) => {
      if (state === "show") {
        this.setState({ forceHide: false });
      } else if (state === "hide") {
        this.setState({ forceHide: true });
      }
    });
  }



  render() {
    const { game, match } = this.props;
    const left = game.map.team_ct.orientation === "left" ? game.map.team_ct : game.map.team_t;
    const right = game.map.team_ct.orientation === "left" ? game.map.team_t : game.map.team_ct;

    const leftPlayers = game.players.filter(player => player.team.side === left.side);
    const rightPlayers = game.players.filter(player => player.team.side === right.side);
    const isFreezetime = (game.round && game.round.phase === "freezetime") || game.phase_countdowns.phase === "freezetime";
    const { forceHide } = this.state;

    return (
      <div className="ScoreBoard">
        <MatchBar map={game.map} phase={game.phase_countdowns} bomb={game.bomb} match={match} />

        <TeamBox team={left} players={leftPlayers} side="left" current={game.player} isFreezetime={isFreezetime} />
        <TeamBox team={right} players={rightPlayers} side="right" current={game.player} isFreezetime={isFreezetime} />

        <TournamentName /> 
      </div>
    );
  }
} 