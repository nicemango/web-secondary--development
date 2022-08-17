import React from "react";
import App from "../src/App";
import "./mockComponentCenter";

const DesignConfiguration = (props) => {
  const customConfig = {
    componentId: "111",
    formConfig: {},
    component: {},
    changeConfiguration: (values) => console.log(values),
    configuration:
      ' {"option_asset_id":"fa27da59-a182-4685-9554-322c0eb85b8f","option_asset_name":"全组件","option_value_column":"danxingwenben","option_key_column":"mima","option_asset_show_columns":["danxingwenben","riqi", "lianjiedizhi", "baifenbi"]}',
  };
  return <App {...customConfig} type="designConfiguration" />;
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
