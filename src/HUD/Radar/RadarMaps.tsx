import React from "react";
import "./radar.scss";
import { Match, Veto } from "../../api/interfaces";
import { Map, CSGO, Team } from 'csgogsi-socket';
import { actions } from './../../App';
import Radar from './Radar'
import Ancient from "../../assets/veto/Ancient.png"
import AncientDead from "../../assets/veto/Ancient-dead.png"
import Dust2 from "../../assets/veto/Dust2.png"
import Inferno from "../../assets/veto/Inferno.png"
import Mirage from "../../assets/veto/Mirage.png"
import Nuke from "../../assets/veto/Nuke.png"
import Overpass from "../../assets/veto/Overpass.png"
import Vertigo from "../../assets/veto/Vertigo.png"




interface Props { match: Match | null, map: Map, game: CSGO, isFreezetime: boolean }
interface State { showRadar: boolean, radarSize: number, showBig: boolean }




export default class RadarMaps extends React.Component<Props, State> {
    state = {
        showRadar: true,
        radarSize: 350, 
        showBig: false
    }
    componentDidMount() {
        actions.on('radarBigger', () => this.radarChangeSize(20));
        actions.on('radarSmaller', () => this.radarChangeSize(-20));
        actions.on('toggleRadar', () => { this.setState(state => ({ showRadar: !state.showRadar })) });

        actions.on("toggleRadarView", () => {
            this.setState({showBig:!this.state.showBig});
        });
    }
    radarChangeSize = (delta: number) => {
        const newSize = this.state.radarSize + delta;
        this.setState({ radarSize: newSize > 0 ? newSize : this.state.radarSize });
    }
    render() {
        const { match, isFreezetime } = this.props;
        const { radarSize, showBig, showRadar } = this.state;
        const size = showBig ? 600 : radarSize;
        return (
            <div id={`radar_maps_container`} className={`${!showRadar ? 'hide' : ''} ${showBig ? 'preview':''}`}>
                <div className="radar-component-container" style={{width: `${size}px`, height: `${size}px`}}><Radar radarSize={size} game={this.props.game} /></div>
                {match ? <MapsBar isFreezetime={isFreezetime} match={this.props.match} map={this.props.map} game={this.props.game} /> : null}
            </div>
        );
    }
}

class MapsBar extends React.PureComponent<Props> {
    render() {
        const { match, map, isFreezetime } = this.props;
        if (!match || !match.vetos.length) return '';
        const picks = match.vetos.filter(veto => veto.type !== "ban" && veto.mapName);
        // if (picks.length > 3) {
        //     const current = picks.find(veto => map.name.includes(veto.mapName));
        //     if (!current) return null;
        //     return <div id="maps_container">
        //     {<MapEntry veto={current} map={map} team={current.type === "decider" ? null : map.team_ct.id === current.teamId ? map.team_ct : map.team_t} />}
        //     <div>
        //     </div>
        // </div>
        // }
        return <div style={{
            justifyContent : !isFreezetime ? 'flex-end' : 'space-around' 
        }} id="maps_container">
            {<BO isFreezetime={isFreezetime} match={match} />}
            {isFreezetime && match.vetos.filter(veto => veto.type !== "ban").filter(veto => veto.teamId || veto.type === "decider").map((veto, index) => <MapEntry key={veto.mapName} veto={veto} map={this.props.map}  team={veto.type === "decider" ? null : map.team_ct.id === veto.teamId ? map.team_ct : map.team_t} />)}
        </div>
    }
}

class MapEntry extends React.PureComponent<{ veto: Veto, map: Map, team: Team| null }> {
    render() {
        const { veto, map } = this.props;
        let icons = ""
        let nameIcons = veto.mapName.replace("de_", "")
        if (nameIcons == "ancient") {
            if (map.name.includes(veto.mapName)) {
                icons = Ancient
            } else {
                icons = AncientDead
            }
        }
        if (nameIcons == "dust2") {
            icons = Dust2
            
        }
        if (nameIcons == "inferno") {
            icons = Inferno
            
        }
        if (nameIcons == "mirage") {
            icons = Mirage
            
        }
        if (nameIcons == "nuke") {
            icons = Nuke
            
        }
        if (nameIcons == "overpass") {
            icons = Overpass
            
        }
        if (nameIcons == "vertigo") {
            icons = Vertigo
            
        }
        return <div className="veto_entry">
            <img src={icons} style={{ width: 15, height: 15 }} />
            <div className={`map_name ${map.name.includes(veto.mapName) ? 'active' : ''}`}>{veto.mapName.replace("de_", "")}</div>  
        </div>
    }
}


class BO extends React.PureComponent<{ match: Match, isFreezetime: boolean}> {
    render() {
        const { match, isFreezetime } = this.props;
        const bo = (match && Number(match.matchType.substr(-1))) || 0;
        return <>
            { !isFreezetime ? 
                <div className="bestof">WE CHAMPIONSHIPS</div>
            :
                <div className="bestof">{ bo ? `BEST OF ${bo}` : '' }</div>
            }
        </>  
    }
}

