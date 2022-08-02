import React from "react";
import App from "../src/App";
import List from "../src/components/list/index"
import "./mockComponentCenter";
import "antd/dist/antd.css";
import { componentCenter, eventCenter } from "./mockComponentCenter";

const PreviewComponent = (props) => {
  const customConfig = {
    componentId: "111",
    formConfig: {},
    component: {},
    componentCenter,
    eventCenter,
    customParams: {
      width: 500,
      videoKey: "videoUrl",
      assetId: "7715734e-ca73-480e-a9e5-e788fc1bb647",
      videoIdKey: "device_id",
    }
  };
  return <List {...customConfig} type="set" />;
};

PreviewComponent.propTypes = {};

export default PreviewComponent;
