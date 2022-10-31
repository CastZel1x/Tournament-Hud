import React from "react";
import { Player} from "csgogsi-socket";
import Avatar from "./Avatar";
import { actions } from "../../../App";
interface IProps {
  player: Player,
  isObserved: boolean,
  isFreezetime: boolean,
}

export default class PlayerBox extends React.Component<IProps, { showBoard: boolean }> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showBoard: false
    }
  }

	componentDidMount() {
		actions.on('toggleBoard', () => {
			console.log(this.state.showBoard)
			this.setState({ showBoard: !this.state.showBoard });
		});
	}
  render() {
    const { player } = this.props;
    return (
      <div className={`player ${player.state.health === 0 ? "dead" : ""} ${this.props.isObserved ? 'active' : ''}`}>
           <div className="KDADR">
              <div className="KDADRleft">
                <div className="kill">KILLS</div>
                <div className="dead">DEATHS</div>
                <div className="adr">ADR</div>
              </div>
              <div className="KDADRright">
                <div className="kill">KILLS</div>
                <div className="dead">DEATHS</div>
                <div className="adr">ADR</div>
              </div>
            </div>
        <div className="player_data">
          <Avatar steamid={player.steamid} height={57} width={57} showSkull={false} showCam={false} sidePlayer={true} />
          <div className="player_stats">
            <div className="username"><div>{player.name}</div></div>
          <div className="statt">
          <div className="value">
            <div className="stat-kill">{player.stats.kills}</div>
            <div className="stat-dead">{player.stats.deaths}</div>
            <div className="stat-adr">{player.state.adr}</div>
          </div>
          </div>
            <div className="active_border"></div>
          </div>
        </div>
      </div>
    );
  }
}