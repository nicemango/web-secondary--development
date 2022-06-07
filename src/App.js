import React, { Component } from "react";
import { Button } from "antd";
import "./app.less";

export default class App extends Component {
  goToStudy = () => {
    window.open(this.props.url);
  };

  render() {
    const { title, desc, imgUrl } = this.props;
    return (
      <div className="infoCard">
        <div className="card-title">{title}</div>
        <div className="card-desc">{desc}</div>
        <Button ghost onClick={this.goToStudy}>
          去学习
        </Button>
        <div className="card-bg">
          <img
            src={imgUrl}
            style={{ width: "55%", height: "50%" }}
            alt="背景"
          ></img>
        </div>
      </div>
    );
  }
}
