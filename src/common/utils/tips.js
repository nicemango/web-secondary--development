import React from "react";
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styles from "../style/utils.module.less";

const getTips = (tips = {}) => {
  const { enabled, content } = tips;

  if (enabled) {
    return (
      <Tooltip title={content}>
        <QuestionCircleOutlined className={styles.tips} />
      </Tooltip>
    );
  } else {
    return null;
  }
};

export { getTips };
