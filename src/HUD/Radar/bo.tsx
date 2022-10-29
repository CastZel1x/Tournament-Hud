import React from "react";
import * as I from "csgogsi-socket";
import { Match } from "../../api/interfaces";

interface Props {
  map: I.Map;
  phase: I.PhaseRaw;
  match: Match | null;
}

export default class BO extends React.Component<Props> {
  render() {
    const { match } = this.props;
    const bo = (match && Number(match.matchType.substr(-1))) || 0;
    return (
        <div id="series_container">
          <div id="series_text">{ bo ? `BEST OF ${bo}` : '' }</div>
        </div>
    );
  }
}