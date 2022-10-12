import React from 'react';

import {configs, actions} from './../../App';
import './tournamentname.scss';

export default class Trivia extends React.Component<any, { title: string, content: string, show: boolean }> {
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
            const trivia = data.trivia;
            if(!trivia) return;

            if(trivia.content){
                this.setState({content:trivia.content})
            }
        });
        actions.on("triviaState", (state: any) => {
            this.setState({show: state === "show"})
        });
        actions.on("toggleTrivia", () => {
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