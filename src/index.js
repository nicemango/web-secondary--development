/* 可以考虑在发布的代码里移除这个css */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */
if (process.env.NODE_ENV !== "production") {
  require("antd/dist/antd.css");
  // 添加 customConfig 进行测试
  let customConfig = {
    filterData: JSON.stringify([
      {
        filterName: "课程系列",
        filterData: [
          "全部",
          "快速入门篇",
          "基础配置篇",
          "进阶设计篇",
          "业务场景篇",
          "功能详解篇",
          "技术专题篇",
          "版本新特性"
        ],
        defaultValue:"全部"
      },
      {
        filterName: "难度等级",
        filterData: [
          "全部",
          "初级",
          "中级",
          "高级"
        ],
        defaultValue:"全部"
      },
      {
        filterName: "产品应用",
        filterData: [
          "全部",
          "了解产品",
          "应用设计",
          "逻辑配置",
          "调查问卷",
          "填报设计",
          "业务流程",
          "数据分析仪",
          "数据图书馆",
          "数据大屏",
          "二次开发",
          "视频源",
          "数据交换机",
          "数据服务",
          "数据源",
          "数据连接器",
          "数据文档",
          "通讯录",
          "系统管理",
          "视图列表"
        ],
        defaultValue:"全部"
      }
    ]),
    title: "测试",
    buttonWidth:100,
    filterIconRight:50
  }
  ReactDOM.render(
    <App customConfig={customConfig}/>,
    document.getElementById("root")
  );
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    ReactDOM.render(<App {...props} />, dom);
  });
}
