import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";
import "../../common/style/formItem.less";

const Set = (props) => {
  const [customPluginConfig, setcustomPluginConfig] = useState({});
  const Event_Center_getName = () => {
    return `${props.formConfig?.form_name}-${props.component.columnStyle.title}`;
  };

  const Event_Center_getParentInfo = () => {
    return { scene: "dataForm" };
  };

  const { columnStyle = {} } = props.component;

  useEffect(() => {
    try {
      if (columnStyle?.customPluginConfig) {
        const customPluginConfig = JSON.parse(columnStyle?.customPluginConfig);
        setcustomPluginConfig(customPluginConfig);
      }
    } catch (e) {
      console.error(e);
    }
  }, [columnStyle?.customPluginConfig]);

  useDelegator(
    props.component.id,
    { Event_Center_getName, Event_Center_getParentInfo },
    eventActionDefine,
    props.formConfig?.id,
    props.child_id,
    props.index,
    { eventCenter: props.eventCenter, componentCenter: props.componentCenter }
  );

  return <Input className={"number-input"} />;
};

Set.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
};

export default Set;
