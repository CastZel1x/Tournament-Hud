import React from 'react';
import * as I from '../../api/interfaces';
import TeamLogo from '../MatchBar/TeamLogo';
import "./matchoverview.scss"

interface IProps {
    match: I.Match,
    show: boolean,
    teams: I.Team[],
    veto: I.Veto | null
}

export default class MatchOverview extends React.Component<IProps> {
	render() {
        const { match, teams, show } = this.props;
        const left = teams.find(team => team._id === match.left.id);
        const right = teams.find(team => team._id === match.right.id);
        if(!match || !left || !right) return null;
		return (
            <div className={`match-overview ${show ? 'show':''}`}>
                <div className="match-overview-title">
                    Upcoming match
                </div>
                <div className="match-overview-teams">
                    <div className="match-overview-team1">
                        <div className="match-overview-team-logo">
                            <TeamLogo team={left} height={50} />
                        </div>
                        <div className="match-overview-team-name">{left.name}</div>
                    </div>
                    <div className="match-overview-vs">vs</div>
                    <div className="match-overview-team2">
                        <div className="match-overview-team-logo">
                            <TeamLogo team={right} height={50} />
                        </div>
                        <div className="match-overview-team-name">{right.name}</div>
                    </div>
                </div>
            </div>
        );
	}
}
