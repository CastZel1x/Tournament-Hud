import React from "react";
import { Player, WeaponRaw } from "csgogsi-socket";
import Weapon from "./../Weapon/Weapon";
import Armor from "./../Indicators/Armor";
import Bomb from "./../Indicators/Bomb";
import Defuse from "./../Indicators/Defuse";
import Avatar from "./Avatar";
import { GSI } from "../../App";
import dead from "../.././assets/kd/dead.svg";
import kill from "../.././assets/kd/kill.svg";
interface IProps {
  player: Player,
  isObserved: boolean,
  isFreezetime: boolean,
}

interface IState {
  startRoundMoney: number;
}

class Statistic extends React.PureComponent<{ label: string; value: string | number, }> {
	render() {
		return (
			<div className="stat">
				<div className="label">{this.props.label}</div>
				<div className="value">{this.props.value}</div>
			</div>
		);
	}
}

export default class PlayerBox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      startRoundMoney: 800
    }
  }
  componentDidMount() {
    GSI.on("freezetimeStart", () => {
      this.setState({ startRoundMoney: this.props.player.state.money });
    });
  }

  render() {
    const { player } = this.props;
    const weapons: WeaponRaw[] = Object.values(player.weapons).map(weapon => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
    const primary = weapons.filter(weapon => !['C4', 'Pistol', 'Knife', 'Grenade', undefined].includes(weapon.type))[0] || null;
    const secondary = weapons.filter(weapon => weapon.type === "Pistol")[0] || null;
    const grenades = weapons.filter(weapon => weapon.type === "Grenade");
    const { stats } = player;
		const ratio = stats.deaths === 0 ? stats.kills : stats.kills / stats.deaths /player.state.adr;
    var moneySpent = Math.abs(this.state.startRoundMoney - player.state.money);
    return (
      <div className={`player ${player.state.health === 0 ? "dead" : ""} ${this.props.isObserved ? 'active' : ''}`}>
        <div className="player_data">
         <Avatar steamid={player.steamid} height={57} width={57} showSkull={false} showCam={false} sidePlayer={true} />
         <div className="obs_ps">  <div className="num">{player.observer_slot}</div>   </div>
          <div className="player_stats">
          { player.state.health > 0 ? <div className={`hp_bar hp_bar_bg`} style={{ width: `${player.state.health}%` }}></div> : null}
            <div className={`hp_bar ${player.state.health <= 20 ? 'low':''}`} style={{ width: `${player.state.health}%` }}></div>



            <div className="row">
              <div className="username">
                <div>{player.name}</div>
              </div>
              <div className="health">
              {player.state.health > 0 ? player.state.health :""}
              </div>
              <div className="armor_and_utility">
              <Bomb player={player} />
              <Armor player={player} />
              <Defuse player={player} />
            </div>
              {player.state.round_kills ? <div className="roundkills-container">{player.state.round_kills}</div> : null}
              <div className="grenades">
                {grenades.map(grenade => (
                  [
                    <Weapon key={`${grenade.name}-${grenade.state}`} weapon={grenade.name} active={grenade.state === "active"} isGrenade />,
                    grenade.ammo_reserve === 2 ? <Weapon key={`${grenade.name}-${grenade.state}-double`} weapon={grenade.name} active={grenade.state === "active"} isGrenade /> : null,
                  ]
                ))}
              </div>
            </div>



            <div className="row_center">
              <div className="weapon">
              {primary || secondary ? <Weapon weapon={primary ? primary.name : secondary.name} active={primary ? primary.state === "active" : secondary.state === "active"} /> : ""}
              </div>
              <div className="statt">

                <img className="kill" src= {kill}
                  width="18px" height="18px" alt="filter applied" />  
                <Statistic label={""} value={stats.kills} />


                <img className="dead" src= {dead} 
                  width="16px" height="17px" alt="filter applied" />  
                <Statistic label={""} value={stats.deaths} />
              </div>
            </div>




            <div className="row_top">
              <div className="money">${player.state.money}</div>
              <div className={`spending ${this.props.isFreezetime && this.props.isFreezetime === true ? 'show' : 'hide'}`}>
                  <div className="value">-${moneySpent}</div>
              </div>
              <div className={`adr ${this.props.isFreezetime && this.props.isFreezetime === true ? 'show' : 'hide'}`}>
                  <div className="stat-label">ADR</div>
                  <div className="stat-value">{player.state.adr}</div>
              </div>
            </div>
            <div className="dead-adr">
                  <div className="labels">
                    <div className="stat-label">ADR</div>
                 </div>
                  <div className="values">
                    <div className="stat-value">{player.state.adr}</div>
                </div>
               </div>
            <div className="active_border"></div>
          </div>
        </div>
      </div>
    );
  }
}