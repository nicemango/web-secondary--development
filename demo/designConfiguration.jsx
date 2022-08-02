import React from "react";
import App from "../src/App";
import Design from "../src/components/designConfiguration/index";
import "./mockComponentCenter";

const DesignConfiguration = (props) => {
  const customConfig = {
    componentId: "111",
    formConfig: {},
    component: {},
    changeConfiguration: (values) => console.log(values),
    configuration:
      '{"width":500, "assetId": "7715734e-ca73-480e-a9e5-e788fc1bb647", "videoKey": "videoUrl" ,"videoIdKey":"device_id"}',
  };
  return <Design {...customConfig} type="designConfiguration" />;
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
