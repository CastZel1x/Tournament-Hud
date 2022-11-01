import React from "react";
import Weapon from "../Weapon/Weapon";
import { Player, WeaponRaw, Side } from "csgogsi-socket";
import * as I from "csgogsi-socket";
import './Utility.scss'

interface Props {
    sides?: 'reversed',
    show: boolean;
    side: 'CT' | 'T',
    players: Player[]
    bomb: I.Bomb | null,
}

function sum(grenades: WeaponRaw[], name: string) {
  return (
    grenades.filter(grenade => grenade.name === name).reduce((prev, next) => ({ ...next, ammo_reserve: (prev.ammo_reserve || 0) + (next.ammo_reserve || 0) }), { name: "", ammo_reserve: 0 })
      .ammo_reserve || 0
  );
}

function parseGrenades(players: Player[], side: Side) {
  const grenades = players
    .filter(player => player.team.side === side)
    .map(player => Object.values(player.weapons).filter(weapon => weapon.type === "Grenade"))
    .flat()
    .map(grenade => ({ ...grenade, name: grenade.name.replace("weapon_", "") }));
  return grenades;
}

export function summarise(players: Player[], side: Side) {
  const grenades = parseGrenades(players, side);
  return {
    hg: sum(grenades, "hegrenade"),
    flashes: sum(grenades, "flashbang"),
    smokes: sum(grenades, "smokegrenade"),
    inc: sum(grenades, "incgrenade") + sum(grenades, "molotov")
  };
}

class GrenadeContainer extends React.PureComponent<{ grenade: string; amount: number }> {
  render() {
    return (
      <div className="grenade_container">
        <div className="grenade_image">
          <Weapon weapon={this.props.grenade} active={false} isGrenade />
        </div>
        <div className="grenade_amount">x{this.props.amount}</div>
      </div>
    );
  }
}

export default class UtilityPlanted extends React.Component<Props> {
    render() {
        const grenades = summarise(this.props.players, this.props.side);
        const total = Object.values(grenades).reduce((a, b) => a+b, 0);
        const { bomb } = this.props;
        const isPlanted = bomb && (bomb.state === "defusing" || bomb.state === "planted");
        return (
          <div id="UtilityPlanted">
                <div id="utilityboxplant" className={isPlanted ? "hide":"show"}>
                <div className="grenades_container">
                    <GrenadeContainer grenade="smokegrenade" amount={grenades.smokes} />
                    <GrenadeContainer grenade={this.props.side === 'CT' ? 'incgrenade' : 'molotov'} amount={grenades.inc} />
                    <GrenadeContainer grenade="flashbang" amount={grenades.flashes} />
                    <GrenadeContainer grenade="hegrenade" amount={grenades.hg} />
                </div>
            </div>
          </div>
        );
    }
}
