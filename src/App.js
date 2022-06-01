import React, { Component } from "react";
// import { Table, Button, message } from "antd";
import * as echarts from "echarts";
import { normalizeData } from "./normalizeData";
import "./app.css";
export default class App extends Component {
  divRef = null;
  state = {
    dataSource: [],
    rowId: "",
    default_value: "",
    id: "",
  };
  fnref = (el) => {
    this.divRef = el;
  };
  initChart = (variable, bigScreen_options, bigScreen_data) => {
    const myChart = echarts.init(this.divRef);

    const data = normalizeData(bigScreen_options, bigScreen_data).map((v) => {
      return {
        value: v[1],
        name: v[0],
      };
    });
    const { default_value = "测试的数据", id = "测试的名称" } = variable;
    this.setState({
      default_value,
      id,
    });

    let option = {
      title: {
        text: "演示数据",
        subtext: "演示二级标题",
        left: "center",
        textStyle: {
          color: "#f0f",
          fontWeight: "bold",
        },
        subtextStyle: {
          color: "#f0f",
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: {
          color: "#f0f",
          fontWeight: "bold",
        },
      },
      series: [
        {
          name: id,
          type: "pie",
          radius: "50%",
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    if (option && typeof option === "object") {
      myChart.setOption(option);
      myChart.resize();
    }
  };

  componentDidMount() {
    if (this.divRef) {
      const bigScreen_options = this.props.options || {};
      const variable = this.props.variable;
      const bigScreen_data = this.props.data || [];

      this.initChart(variable, bigScreen_options, bigScreen_data);
    }
    const { pubSub } = this.props;
    pubSub &&
      pubSub.subscribe(
        "updateChart" + this.props.customConfig.componentId,
        (data) => {
          if (this.divRef) {
            const bigScreen_options = data.options || {};
            const variable = data.variable;
            const bigScreen_data = data.data || [];

            this.initChart(variable, bigScreen_options, bigScreen_data);
          }
        }
      );

    const events = [
      {
        key: "onClick",
        name: "点击",
        payload: [
          {
            name: "名称",
            dataType: "string",
            key: "name",
          },
        ],
      },
    ];

    const actions = [
      {
        key: "messageSuccess",
        name: "成功提示",
        params: [
          {
            key: "value",
            name: "值",
            dataType: "string",
          },
        ],
      },
    ];

    window.componentCenter?.register &&
      window.componentCenter.register(this.props.componentId, "comp", this, {
        events,
        actions,
      });
    this.props?.updateProcess && this.props.updateProcess();

    this.Event_Center_getName = () => {
      return "Demo实例";
    };
  }
  do_EventCenter_messageSuccess(param) {
    console.log(param);
    alert(`接受的数据为：${JSON.stringify(param)}`);
  }

  render() {
    const { default_value, id } = this.state;
    const { data, options, variable, componentId } = this.props;

    return (
      <>
        <div
          className="card-bg"
          onClick={() => {
            window.eventCenter.triggerEvent(componentId, "onClick", {
              name: "二开插件",
            });
          }}
        >
          配置两个插件之后，点这里进行逻辑控制测试
        </div>
        {data && options && (
          <div style={{ color: "#ffffff" }}>
            展示接收到的变量值:{default_value}
          </div>
        )}
        {data && options && (
          <div style={{ color: "#ffffff" }}>展示接收到的变量ID:{id}</div>
        )}
        {data && options && (
          <div ref={this.fnref} style={{ width: "100%", height: "100%" }}></div>
        )}
        {!(data && options) && <div>请配置数据</div>}
      </>
    );
  }
}
