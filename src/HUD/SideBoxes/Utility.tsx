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
    return "ECO";
  }
  return "NO UTILITY";
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

export default class SideBox extends React.Component<Props> {
    render() {
        const grenades = summarise(this.props.players, this.props.side);
        const total = Object.values(grenades).reduce((a, b) => a+b, 0);
        return (
            <div className={`utilityboxUtility ${this.props.side || ''} ${this.props.show ? "show" : "hide"}`}>
              <div className={`utilityboxUtility ${this.props.side || ''} ${this.props.show ? "show" : "hide"}`}></div>
              <div className="title_container">
                  <div className='title_economy'>Utillity</div>
              </div>
              <div className="container_row">
                {
                    this.props.side == "T" &&
                    <div className="subtitle" style={{color: utilityColor(total)}}>{utilityState(total)}</div>
                }
                <div className="grenades_container">
                    <GrenadeContainer grenade="smokegrenade" amount={grenades.smokes} />
                    <GrenadeContainer grenade={this.props.side === 'CT' ? 'incgrenade' : 'molotov'} amount={grenades.inc} />
                    <GrenadeContainer grenade="flashbang" amount={grenades.flashes} />
                    <GrenadeContainer grenade="hegrenade" amount={grenades.hg} />
                </div>
                {
                    this.props.side == "CT" &&
                    <div className="subtitle" style={{color: utilityColor(total)}}>{utilityState(total)}</div>
                }
              </div>
            </div>
        );
    }
}