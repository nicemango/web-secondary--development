import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";

import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";

const { Option } = Select;
const Set = (props) => {
  const Event_Center_getName = () => {
    return `${props.formConfig?.form_name}-${props.component.columnStyle.title}`;
  };

  const Event_Center_getParentInfo = () => {
    return { scene: "dataForm" };
  };

  useDelegator(
    props.component.id,
    { Event_Center_getName, Event_Center_getParentInfo },
    eventActionDefine,
    props.formConfig?.id,
    props.child_id,
    props.index,
    { eventCenter: props.eventCenter, componentCenter: props.componentCenter }
  );
  return (
    <Select style={{ width: "100%" }}>
      <Option value="a">1</Option>
      <Option value="b">2</Option>
      <Option value="c">3</Option>
    </Select>
  );
};

Set.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
};

export default Set;
