import React from "react";
import App from "../src/App";
import "./mockComponentCenter";

const DesignConfiguration = (props) => {
  const customConfig = {
    componentId: "11122",
    formConfig: {},
    component: {},
    changeConfiguration: (values) => console.log(values),
    dataId: "111",
  };
  return <App {...customConfig} type="list" />;
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
