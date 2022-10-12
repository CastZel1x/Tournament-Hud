import React from 'react';

import {configs, actions} from './../../App';
import './tournamentname.scss';

export default class Tournament extends React.Component<any, { title: string, content: string, show: boolean }> {
	constructor(props: any) {
		super(props);
		this.state = {
            title:'Title',
            content:'Content',
            show: false
		}
	}

	componentDidMount() {
        configs.onChange((data:any) => {
            if(!data) return;
            const tournament = data.tournament;
            if(!tournament) return;

            if(tournament.content){
                this.setState({content:tournament.content})
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
                <div className="content">{this.state.content}</div>
            </div>
		);
	}

}