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
      ' {"option_asset_id":"3183da26-6cf8-58ae-ef7b-46e4d2f36489","option_asset_name":"全组件","option_value_column":"danxingwenben","option_key_column":"mima","option_asset_show_columns":["danxingwenben","riqi", "lianjiedizhi", "baifenbi"]}',
  };
  return <App {...customConfig} type="designConfiguration" />;
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
