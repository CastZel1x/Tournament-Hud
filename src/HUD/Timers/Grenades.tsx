import React from "react";
import Weapon from "./../Weapon/Weapon";
import { Player, WeaponRaw, Side } from "csgogsi-socket";
import './Grenades.scss';

interface Props {
    sides?: 'reversed',
    side: 'CT' | 'T',
    players: Player[]
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

export default class Grenade extends React.Component<Props> {
    render() {
        const grenades = summarise(this.props.players, this.props.side);
        return (  
          <div className="grenades_container">
            <GrenadeContainer grenade="smokegrenade" amount={grenades.smokes} />
            <GrenadeContainer grenade={this.props.side === 'CT' ? 'incgrenade' : 'molotov'} amount={grenades.inc} />
            <GrenadeContainer grenade="flashbang" amount={grenades.flashes} />
            <GrenadeContainer grenade="hegrenade" amount={grenades.hg} />
          </div>
        );
    }
}


