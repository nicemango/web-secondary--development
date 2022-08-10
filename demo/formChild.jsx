import React from "react";
import App from "../src/App";
import { componentCenter, eventCenter } from "./mockComponentCenter";

const PreviewComponent = (props) => {
  const customConfig = {
    componentId: "111",
    data: "111",
    onChange: (values) => {
      console.log(values);
      setState(values);
    },
    formConfig: {},
    component: {},
    configuration:
      '{"num_min_value":1,"num_max_value":99,"allowClear":true,"precision":2}',
    componentCenter,
    eventCenter,
  };

  const [state, setState] = React.useState(customConfig.data);

  return (
    <div>
      <App {...customConfig} type="child" />
      <br />
      <br />
      <div>回填值: {customConfig.data}</div>
      <div>当前保存在后台的值: {state}</div>
    </div>
  );
};

PreviewComponent.propTypes = {};

export default PreviewComponent;
