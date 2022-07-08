import React from "react";
import App from "../src/App";

const Preview = (props) => {
  const obj = {
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
      S4: {
        shape: "nodeDom",
        label: "S4:书名提取",
        image: "EN_0001_hover.png",
        size: [55, 55],
        x: 568,
        y: 217,
        input: 1,
        output: 999,
        data: {
          text: {
            code: "S4",
            internalName: "书名提取",
          },
        },
        nodeid: "EN_98745678a4",
        id: 4,
        img: "EN_0001.png",
        obj_id: "f4705e7a-4a08-4b89-9282-01e2b4ad9301",
      },
    },
    currentNode: "S2",
    nodeCode: "EN_98745678",
    obj_id: "f4705e7a-4a08-4b89-9282-01e2b4ad9301",
    updateNode: (detail) => {
      console.log(detail);
    },
  };
  return <App {...obj}></App>;
};

Preview.propTypes = {};

export default Preview;
