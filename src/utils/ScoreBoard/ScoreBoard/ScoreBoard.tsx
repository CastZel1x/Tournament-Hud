import React from "react";
import { CSGO, Team } from "csgogsi-socket";
import { Match } from "../../../api/interfaces";
import './ScoreBoard.scss'

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
}
