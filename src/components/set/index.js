import React from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";
import "../../common/style/formItem.less";

const Set = (props) => {

  const isChildTableComponent = (showType) => {
    if (
      showType === "childtable" ||
      showType === "controlled_child_table" ||
      showType === "pop_up_selection_child_table" ||
      showType === "correlation_child_table"
    ) {
      return true;
    }
    return false;
  };

  const Event_Center_getName = () => {
    let { component } = props;
    if (component.parent && isChildTableComponent(component.parent.showType)) {
      return `${component.parent?.columnStyle?.title}-${component.columnStyle.title}`;
    }
    return `${component.columnStyle.title}`;
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

  return <Input className={"number-input"} />;
};

Set.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
};

export default Set;
