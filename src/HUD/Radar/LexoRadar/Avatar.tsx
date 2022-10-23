import React from 'react';
import { avatars } from './../../../api/avatars';
import { Skull } from './../../../assets/Icons';

interface IProps {
  steamid: string,
  height?: number,
  width?: number,
  showSkull?: boolean,
  isAlive?: boolean,
}
export default class Avatar extends React.Component<IProps> {

  render() {
    const { steamid, width, height, showSkull, isAlive } = this.props;
    const avatarData = avatars[this.props.steamid];
    if (!avatarData || !avatarData.url) {
      return null;
    }
    
    return (
    <div className={`map-avatar ${!isAlive ? 'map-dead' : ''}`}>
        {
        showSkull ? <Skull height={height} width={width} /> : <img src={avatarData.url} height={height} width={width} alt={steamid} />
        }
    </div>
    );
  }
}
