import React from "react";
import { Player } from "csgogsi-socket";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import TeamLogo from "./../MatchBar/TeamLogo";
import "./observed.scss";
import { getCountry } from "./../countries";
import { ArmorHelmet, ArmorFull, HealthFull, Bullets } from './../../assets/Icons';
import { Veto } from "../../api/interfaces";
import { actions } from "../../App";
import roundkill from "../.././assets/roundkill.png";



export default class Observed extends React.Component<{ player: Player | null, veto: Veto | null, round: number }, { showCam: boolean }> {
	constructor(props: any){
		super(props);
		this.state = {
		  showCam: true
		}
	  }

	componentDidMount() {
		actions.on('toggleCams', () => {
			console.log(this.state.showCam)
			this.setState({ showCam: !this.state.showCam });
		});
	}
	render() {
		if (!this.props.player) return '';
		const { player } = this.props;
		const country = player.country || player.team.country;
		const weapons = Object.values(player.weapons).map(weapon => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
		const currentWeapon = weapons.filter(weapon => weapon.state === "active")[0];
		const grenades = weapons.filter(weapon => weapon.type === "Grenade");
		return (
			<div className={`observed ${player.team.side}`}>
				<div className="main_row">
					{<Avatar steamid={player.steamid} height={160} width={160} showCam={this.state.showCam} slot={player.observer_slot} />}
					<div className="username_container">
						<div className="username">{player.name}</div>
					</div>
				</div>
				<div className="stats_row">
					<div className="health_armor_container">
						<div className="health-icon icon">
							<HealthFull />
						</div>
						<div className="health text">{player.state.health}</div>
						<div className="spacehealth"> ㅤ</div>
						<div className="armor-icon icon">
							{player.state.helmet ? <ArmorHelmet /> : <ArmorFull />}
						</div>
						<div className="health text">{player.state.armor}</div>
					</div>
					<div className="roundkills-container">
					{player.state.round_kills > 0 ? <img className="round_kills" src= {roundkill} 
             				 width="21px" height="18px" alt="filter applied" /> : null}  
					{player.state.round_kills ? <div className="roundkills-num">{player.state.round_kills}</div> : null}
					</div>
					<div className="grenade_container">
						{grenades.map(grenade => <React.Fragment key={`${player.steamid}_${grenade.name}_${grenade.ammo_reserve || 1}`} >
						<Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade />
							{
								grenade.ammo_reserve === 2 ? <Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade /> : null}
						</React.Fragment>)}
					</div>
					<div className="ammo">
						<div className="ammo_icon_container">
							<Bullets />
						</div>
						<div className="ammo_counter">
							<div className="ammo_clip">{(currentWeapon && currentWeapon.ammo_clip) || "-"}</div>
							<div className="ammo_reserve">/{(currentWeapon && currentWeapon.ammo_reserve) || "-"}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}