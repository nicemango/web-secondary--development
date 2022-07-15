import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";

const Set = (props) => {
  const flag = ''
  const Event_Center_getName = () => {
    return `${props.formConfig?.form_name}-${props.component.columnStyle.title}`;
  };

  useDelegator(
    props.component.id,
    { Event_Center_getName },
    eventActionDefine,
    props.formConfig?.id,
    props.child_id,
    props.index,
    { eventCenter: window.eventCenter, componentCenter: window.componentCenter }
  );
  return <div>

  </div>;
};

Set.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
};

export default Set;
