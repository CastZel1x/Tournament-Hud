import React from "react";
import { PhaseRaw } from "csgogsi-socket";

interface IProps {
    phase: PhaseRaw | null,
    isFreezetime: any
}

export default class Pause extends React.Component<IProps> {
    render() {
        const { phase, isFreezetime } = this.props;
        return (
            <div id={`pause`} className={phase && phase.phase === "paused" ? 'show' : ''} 
                style={{ 
                    top: isFreezetime ? 171 : 120,
                    width: isFreezetime ? 500 : 440
                }}>
                TECHNICAL PAUSE
            </div>
        );
    }
}
