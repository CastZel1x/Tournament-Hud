import React from 'react';
import { Team } from 'csgogsi-socket';
import * as I from '../../api/interfaces';
import { apiUrl } from './../../api/api';

export default class TeamLogo extends React.Component<{ team?: Team | I.Team | null | any, height?: number, width?: number, label: Boolean}> {
  render(){
    const { team, label } = this.props;
    if(!team) return null;
    let id = '';
    const { logo } = team;
    if('_id' in team){
      id = team._id;
    } else if('id' in team && team.id){
      id = team.id;
    }
    
    return (
      <div className={`logo ${team?.side}`}>
          { logo && id ? <img src={`${apiUrl}api/teams/logo/${id}`} width={this.props.width} height={this.props.height} alt={'Team logo'} /> : ''}
          {
            label &&
            <div style={{ color: '#fff'}}>{team.country}</div>
          }
      </div>
    );
  }

}
