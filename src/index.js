import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";

// 是否是生产环境
if (process.env.NODE_ENV !== "production") {
  // 调试的时候使用
  const props = {
    nodeFieldList: {
      S2: {
        S2: [
          {
            displayed: 1,
            col_index: 1,
            asset_id: "2fd81d3f-6993-0e78-c308-0b06ed7836a8",
            col_name: "书名",
            col_datatype: 0,
            import_flag: false,
          },
          {
            displayed: 1,
            col_index: 2,
            asset_id: "2fd81d3f-6993-0e78-c308-0b06ed7836a8",
            col_name: "输出书名",
            col_datatype: 0,
            import_flag: false,
          },
        ],
      },
    },
    nodeInfoList: {
      S2: {
        image: "EN_0001_hover.png",
        img: "EN_0001.png",
        obj_id: "f4705e7a-4a08-4b89-9282-01e2b4ad9301",
        shape: "nodeDom",
        data: {
          basicattrs: {
            classname: "com.sdata.customize.dataflow.CustomizeNode",
          },
          detail: {
            columns: [
              {
                displayed: 1,
                col_index: 1,
                asset_id: "2fd81d3f-6993-0e78-c308-0b06ed7836a8",
                col_name: "书名",
                col_datatype: 0,
                import_flag: false,
              },
            ],
          },
          text: {
            internalName: "书名提取",
            code: "S2",
          },
        },
        label: "S2:书名提取",
        output: 999,
        input: 1,
        size: [55, 55],
        x: 605,
        y: 221,
        id: 2,
        nodeid: "EN_98745678a2",
      },
    },
    currentNode: "S2",
    nodeCode: "EN_98745678",
    obj_id: "f4705e7a-4a08-4b89-9282-01e2b4ad9301",
    updateNode: detail => {
      console.log(detail);
    },
  };
  require("antd/dist/antd.css");
  ReactDOM.render(<App {...props} />, document.getElementById("root"));
} else {
  // 提供给二开加载器的挂载方式
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(process.env.CUSTOM_PLUGIN_ID, (dom, props) => {
    ReactDOM.render(<App {...props} />, dom);
  });
}

/**
 * 生产打包时为了减少体积，不引入 antd.css (可节约 2.5M左右的包体积)
 * 生产包是当做 onemind 主站插件使用的，页面里已经有一份 ant.css 了，所以这里可以省去
 * 从功能通过 webpack.IgnorePlugin 插件实现，如果想要打入此 css，请在 webpack 配置中做修改。
 */
