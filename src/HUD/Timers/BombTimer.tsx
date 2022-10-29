import React from "react";

import { GSI } from "./../../App";
import BombTimer from "./Countdown";
import { C4 } from "./../../assets/Icons";

export default class Bomb extends React.Component<any, { width: number; show: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = {
      width: 0,
      show: false
    };
  }
  hide = () => {
    this.setState({ show: false, width: 100 });
  };
  componentDidMount() {
    const bomb = new BombTimer(time => {
      let width = time > 40 ? 4000 : time * 100;
      this.setState({ width: width / 40 });
    });
    bomb.onReset(this.hide);
    GSI.on("data", data => {
      if (data.bomb && data.bomb.countdown) {
        if (data.bomb.state === "planted") {
          this.setState({ show: true });
          return bomb.go(data.bomb.countdown);
        }
        if (data.bomb.state !== "defusing") {
          this.hide();
        }
      } else {
        this.hide();
      }
    });
  }

  render() {
    return (
      <div id={`bomb_container`}>
        <div className={`bomb_timer ${this.state.show ? "show" : "hide"}`} style={{ width: `${this.state.width}%` }}>
        </div>
        <div className={`bomb_icon ${this.state.show ? "show" : "hide"}`}>
        <div className={`planted ${this.state.show ? "show" : "hide"}`}>PLANTED</div>
          <C4 fill="white" />
        </div>
      </div>
    );
  }
}