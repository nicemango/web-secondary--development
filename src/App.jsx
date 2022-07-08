import React, { useState } from "react";
import { Input, Select } from "antd";
import "./app.less";

const { Option } = Select;

const App = props => {
  const {
    nodeFieldList = {},
    nodeInfoList = {},
    currentNode,
    obj_id,
    customIcon = {},
    img,
  } = props;
  let detail = nodeInfoList[currentNode] || {};
  let currentfieldList = nodeFieldList[currentNode] || {};
  let label = detail.label?.split(":")[1];
  let field = detail.data?.detail?.columns || [];

  const [nodeName, setNodeName] = useState(label);
  const [fields, setFields] = useState(field);

  const tests = currentfieldList[currentNode] || [];

  const updateNode = (newName, newFields) => {
    detail.data = detail.data || {};
    detail.data.detail = detail.data.detail || {};
    detail.data.text = {
      internalName: newName,
      code: currentNode,
    };
    detail.data.detail.columns = newFields;
    detail.label = currentNode + ":" + newName;
    props.updateNode(detail);
  };

  const inputChangeVal = e => {
    setNodeName(e.target.value);
    updateNode(e.target.value, fields);
  };

  const changeField = fieldOpt => {
    const ele = tests.filter(test => fieldOpt.includes(test.col_name));
    setFields(ele);
    updateNode(nodeName, ele);
  };

  return (
    <div className="custom-node">
      <div className="modleTop">
        {customIcon.html ? (
          <div
            className="NodeIcon"
            style={{ marginTop: 6 }}
            dangerouslySetInnerHTML={{ __html: customIcon.html }}
          />
        ) : (
          <img
            className="NodeIcon"
            src={`${window.location.origin}/storage_area/ext_plugins/web/${obj_id}/images/${img}`}
            alt=""
          />
        )}
        <Input
          placeholder="动态输入"
          value={nodeName}
          onChange={inputChangeVal}
          style={{ marginTop: "15px", width: "200px" }}
        />
      </div>
      <div className="custom-node-content">
        <div className="content-row">
          <div className="row-left">选择字段：</div>
          <div className="row-right">
            <Select
              className="textClass"
              style={{ width: "200px", marginLeft: "10px" }}
              onChange={changeField}
              allowClear
              showSearch
              mode="multiple"
              value={fields.map(_ => _.col_name)}
            >
              {tests.map(item => (
                <Option key={item.col_index} value={item.col_name}>
                  {item.col_name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
