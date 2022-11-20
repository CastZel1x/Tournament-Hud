import React from 'react';
import './tournamentname.scss';

import {configs, actions} from './../../App';

export default class Tournament extends React.Component<any, { tournamentname: string, tournamentinfo: string, show: boolean }> {
	constructor(props: any) {
		super(props);
		this.state = {
            tournamentname:'14th World Championship',
            tournamentinfo:'Group Stage - Day 1',
            show: true
		}
	}

	componentDidMount() {
        configs.onChange((data:any) => {
            if(!data) return;
            const tournament = data.tournament;
            if(!tournament) return;

            if(tournament.tournamentname && tournament.tournamentinfo){
                this.setState({tournamentname:tournament.tournamentname, tournamentinfo:tournament.tournamentinfo})
            }
        });
        actions.on("tournamentState", (state: any) => {
            this.setState({show: state === "show"})
        });
        actions.on("toggleTournament", () => {
            this.setState({show: !this.state.show})
        });
	}
	
	render() {
		return (
			<div className={`tournament_container ${this.state.show ? 'show': 'hide'}`}>
                <div className="tournamentname">{this.state.tournamentname}</div>
                <div className="tournamentinfo">{this.state.tournamentinfo}</div>
            </div>
		);
	}

}