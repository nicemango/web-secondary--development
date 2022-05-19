import React, { Component } from "react";
import { Button, Card } from "antd";
import "./app.less";

export default class App extends Component {
  componentDidMount() {
    const events = [
      {
        key: "jumpButton",
        name: "跳转按钮",
        payload: [],
      },
    ];

    const actions = [
      {
        key: "messageSuccess",
        name: "刷新页面",
      },
    ];
    this.props?.customConfig?.componentId &&
      window.componentCenter?.register(
        this.props?.customConfig?.componentId,
        "",
        this,
        {
          events,
          actions,
        }
      );
  }

  goToStudy = () => {
    this.props?.customConfig?.url && window.open(this.props?.customConfig?.url);
  };

  do_EventCenter_messageSuccess() {
    window.location.reload();
  }

  // 逻辑控制用，不可删
  Event_Center_getName() {
    return "应用二开测试";
  }

  render() {
    const { customConfig } = this.props;
    const { title, desc, url, color, componentId } = customConfig || {};
    return (
      <Card
        className="infoCard"
        bordered={false}
        title={<span className="card-title">{title || "数据构建"}</span>}
        extra={
          <Button
            ghost
            onClick={() => {
              window?.eventCenter?.triggerEvent(componentId, "jumpButton");
            }}
          >
            跳转
          </Button>
        }
        style={{
          background: color || "#0454f2",
        }}
      >
        <p className="card-desc">
          {desc || "无码化应用搭建，弹指间即完成数据从无到有到收集和使用"}
        </p>
        <Button
          ghost
          onClick={() => {
            window.open(url || "https://www.sdata1010.cn/");
          }}
        >
          前往
        </Button>
      </Card>
    );
  }
}
