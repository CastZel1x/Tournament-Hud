import React from "react";
import * as I from "csgogsi-socket";
import { Match, Veto } from '../../api/interfaces';
import TeamLogo from "../MatchBar/TeamLogo";
import "./mapseries.scss";
import touch from "../.././assets/mapseries/touch.png";
import score1 from "../.././assets/mapseries/score.png";
import winmap1 from "../.././assets/mapseries/win.png";

interface IProps {
    match: Match | null;
    teams: I.Team[];
    isFreezetime: boolean;
    map: I.Map
}

interface IVetoProps {
    veto: Veto;
    teams: I.Team[];
    active: boolean;
}

class VetoEntry extends React.Component<IVetoProps> {
    render(){
        const { veto, teams, active } = this.props;
        return <div className={`veto_container ${active ? 'active' : ''} ${veto.mapName}`}>
            <div className="veto_map_name">
                {veto.mapName.replace("de_","")}
            </div>
            <div className="veto_picker">
                <TeamLogo team={teams.filter(team => team.id === veto.teamId)[0]} />
            </div>
            <div className="veto_winner">
                <TeamLogo team={teams.filter(team => team.id === veto.winner)[0]} />
            </div>
            <div className="veto_score">
                {Object.values((veto.score || ['-','-'])).sort().join(":")}
            </div>
            <div className='active_container'>
                <div className='active'>live</div>
            </div>
        </div>
    }
}




export default class MapSeries extends React.Component<IProps> {

    render() {
        const { match, teams, isFreezetime, map } = this.props;
        if (!match || !match.vetos.length) return null;
        return (
            <div className={`map_series_container ${isFreezetime ? 'show': 'hide'}`}>
                <div className="title_bar">
                    
                <img className="touch" src= {touch}
                     width="27px" height="28px" alt="filter applied" />  
                    <div className="picked"></div>

                    <img className="winmap1" src= {winmap1}
                     width="27px" height="28px" alt="filter applied" />  
                    <div className="winner"></div>

                <img className="score1" src= {score1}
                     width="27px" height="28px" alt="filter applied" />  
                    <div className="score"></div>
                </div>
                {match.vetos.filter(veto => veto.type !== "ban").map(veto => {
                    if(!veto.mapName) return null;
                    return <VetoEntry key={`${match.id}${veto.mapName}${veto.teamId}${veto.side}`} veto={veto} teams={teams} active={map.name.includes(veto.mapName)}/>
                })}
            </div>
        );
    }
}