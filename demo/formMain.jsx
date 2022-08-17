import React, { useState } from "react";
import { Radio } from "antd";
import App from "../src/App";
import { componentCenter, eventCenter } from "./mockComponentCenter";

const optionsWithDisabled = [
  { label: "默认", value: "default" },
  { label: "军绿", value: "militaryGreen" },
  { label: "传统", value: "tradition" },
];

const PreviewComponent = (props) => {
  const [theme, setTheme] = useState("default");
  const customConfig = {
    componentId: "111",
    data: "111",
    onChange: (values) => {
      console.log(values);
      setState(values);
    },
    formConfig: {
      theme,
    },
    component: {},
    configuration:
      '{"option_asset_id":"3183da26-6cf8-58ae-ef7b-46e4d2f36489","option_asset_name":"全组件","option_value_column":"danxingwenben","option_key_column":"mima","option_asset_show_columns":["danxingwenben","riqi", "lianjiedizhi", "baifenbi","data_id"]}',
    componentCenter,
    eventCenter,
  };
  const [state, setState] = React.useState(customConfig.data);

  return (
    <div>
      <Radio.Group
        options={optionsWithDisabled}
        onChange={(value) => {
          setTheme(value.target.value);
        }}
        value={theme}
        optionType="button"
        buttonStyle="solid"
      />
      <br />
      <App {...customConfig} type="add" />
      <br />
      <br />
      <div>回填值: {customConfig.data}</div>
      <div>当前保存在后台的值: {state}</div>
      <div>当前配置项: {customConfig.configuration}</div>
    </div>
  );
};

PreviewComponent.propTypes = {};

export default PreviewComponent;
