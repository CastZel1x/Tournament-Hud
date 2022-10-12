import React from 'react';

import {configs, actions} from './../../App';

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

            if(trivia.title && trivia.content){
                this.setState({title:trivia.title, content:trivia.content})
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
			<div className={`trivia_container ${this.state.show ? 'show': 'hide'}`}>
                <div className="title">{this.state.title}</div>
                <div className="content">{this.state.content}</div>
            </div>
		);
	}

}






/*    <div className="Tournament">
        <div className="TournamentLeft">IEM Katwoice Major 2019</div>     
        <div className="TournamentRight">BO3 | Day 8 | Grand Final</div>
      </div>    





      .Tournament {
	position: relative;
	text-align: center;
	top: 7px;
	font-size: 17px;
	right: 89px;
	.TournamentRight {
		background-color: rgba(0,14,37,0.7);
		color: white;
		position: absolute;
		left: 1050px;
		width: 566px;
		border-radius: 0 12px 0 0 ;
}


	.TournamentLeft {
		background-color: rgba(0,14,37,0.7);
		color: white;
		position: absolute;
		left: 484px;
		width: 566px;
		border-radius: 12px 0 0 0 ;
	}
}
*/