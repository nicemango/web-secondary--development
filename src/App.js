import React, { Component } from "react";
import { Table, Button, message } from "antd";
import "./app.less";

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

export default class App extends Component {
  state = {
    dataSource: [],
    rowId: "",
    columns: [],
  };

  constructor(props) {
    super(props);
    const { pubSub } = props;
    pubSub?.subscribe &&
      pubSub.subscribe("analyzeDataSource", data => {
        this.loadTableFromData && this.loadTableFromData(data);
      });
  }

  loadTableSource = data => {
    let title = data[0];
    try {
      const columns = title.map((item, index) => ({
        title: item,
        dataIndex: item,
        key: index,
        align: "center",
        ellipsis: true,
      }));
      this.setState({ columns });
    } catch (error) {
      console.error(error);
    }
    let dataSourceInit = data.slice(1);
    let dataSource = [];
    dataSourceInit.forEach((item, index) => {
      let obj = {};
      item.forEach((it, i) => {
        obj[title[i]] = it;
        obj.key = index;
      });
      dataSource.push(obj);
    });
    this.setState({ dataSource });
  };

  componentDidMount() {
    const { dataSource, updateProcess, componentId } = this.props;
    const data = dataSource;
    this.loadTableSource(data);

    window?.componentCenter?.register(componentId, "comp", this, {
      events,
      actions,
    });
    updateProcess && updateProcess();

    this.Event_Center_getName = () => {
      return "Demo实例";
    };
  }

  do_EventCenter_messageSuccess(param) {
    console.log(param);
    alert("动作执行成功！");
  }

  moveToTop = () => {
    if (this.isSelected()) {
      const { rowId, dataSource } = this.state;
      if (rowId === 0) {
        message.warn("已在第一行，不能再置顶！");
      } else {
        let data = dataSource;
        let temporaryData = data.splice(rowId, 1)[0];
        data.unshift(temporaryData);
        this.setState({ dataSource: [...data], rowId: 0 });
      }
    }
  };

  moveUp = () => {
    if (this.isSelected()) {
      const { rowId, dataSource } = this.state;
      if (rowId === 0) {
        message.warn("已在第一行，不能再上移！");
      } else {
        let data = dataSource;
        let temporaryData = data[rowId];
        data[rowId] = data[rowId - 1];
        data[rowId - 1] = temporaryData;
        this.setState({ dataSource: [...data], rowId: rowId - 1 });
      }
    }
  };

  moveDown = () => {
    if (this.isSelected()) {
      const { rowId, dataSource } = this.state;
      if (rowId === dataSource.length - 1) {
        message.warn("已在最后一行，不能再下移！");
      } else {
        let data = dataSource;
        let temporaryData = data[rowId];
        data[rowId] = data[rowId + 1];
        data[rowId + 1] = temporaryData;
        this.setState({ dataSource: [...data], rowId: rowId + 1 });
      }
    }
  };

  moveToBottom = () => {
    if (this.isSelected()) {
      const { rowId, dataSource } = this.state;
      if (rowId === dataSource.length - 1) {
        message.warn("已在最后一行，不能再置底！");
      } else {
        let data = dataSource;
        let temporaryData = data.splice(rowId, 1)[0];
        data.push(temporaryData);
        this.setState({ dataSource: [...data], rowId: dataSource.length - 1 });
      }
    }
  };

  setRowClassName = (_, index) => {
    return index === this.state.rowId ? "selected-row" : "";
  };

  isSelected = () => {
    const { rowId } = this.state;
    rowId === "" && message.warn("请选择要调整的行！");
    return rowId !== "";
  };

  render() {
    const { dataSource, rowId, columns } = this.state;
    const { componentId, options = {} } = this.props;
    const { externalVariables = {} } = options;
    const { headerBGColor = "#0f2437" } = externalVariables;
    return (
      <div className="analyzer-demo" style={{ width: "100%", height: "100%" }}>
        <div className="func-area" style={{ backgroundColor: headerBGColor }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: "20px",
            }}
          >
            <label
              style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}
            >
              优先级调整
            </label>
            <Button onClick={this.moveToTop} size="small">
              置顶
            </Button>
            <Button onClick={this.moveUp} size="small">
              上移
            </Button>
            <Button onClick={this.moveDown} size="small">
              下移
            </Button>
            <Button onClick={this.moveToBottom} size="small">
              置底
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          size="small"
          rowClassName={this.setRowClassName}
          onRow={(_, index) => {
            return {
              onClick: () => {
                this.setState({ rowId: rowId === index ? "" : index });
                window?.eventCenter?.triggerEvent(componentId, "onClick", {
                  name: "二开插件",
                });
              },
            };
          }}
          scroll={{ y: "calc(100% - 39px)" }}
          style={{ height: "calc(100% - 63px)" }}
        />
        <div
          className="card-bg"
          onClick={() => {
            window?.eventCenter?.triggerEvent(componentId, "onClick", {
              name: "二开插件",
            });
          }}
        >
          点这里
        </div>
      </div>
    );
  }
}
