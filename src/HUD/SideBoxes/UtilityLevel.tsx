import React from "react";
import Weapon from "./../Weapon/Weapon";
import { Player, WeaponRaw, Side } from "csgogsi-socket";


interface Props {
    sides?: 'reversed',
    show: boolean;
    side: 'CT' | 'T',
    players: Player[]
}


function utilityState(amount: number) {
  if (amount > 16) {
    return "FULL BUY";
  }
  if (amount > 9) {
    return "SEMI BUY";
  }
  if (amount > 2) {
    return "EKO";
  }
  return "None";
}

function utilityColor(amount: number) {
  if (amount > 16) {
    return "#22f222";
  }
  if (amount > 9) {
    return "#8ef218";
  }
  if (amount > 2) {
    return "#f25618";
  }
  return "#f21822";
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

export default class SideBox extends React.Component<Props> {
    render() {
        const grenades = summarise(this.props.players, this.props.side);
        const total = Object.values(grenades).reduce((a, b) => a+b, 0);
        return (
            <div className={`utilitybox ${this.props.side || ''} ${this.props.show ? "show" : "hide"}`}>
            <div className={`utilitybox ${this.props.side || ''} ${this.props.show ? "show" : "hide"}`}></div>
                <div className="title_container">
                    <div className="subtitle" style={{color: utilityColor(total)}}>{utilityState(total)}</div>
                </div>
            </div>
        );
    }
}