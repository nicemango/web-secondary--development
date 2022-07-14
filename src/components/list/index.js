import React, { useEffect, useState, useRef } from "react";

import PropTypes from "prop-types";
import { Row, Col, Modal, Input, Form, Button, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { verifyPassword } from "../../api/asset";
import "./index.less";

const List = ({ configuration }) => {
  const [config, setConfig] = useState({});
  useEffect(() => {
    try {
      setConfig(JSON.parse(configuration || "{}"));
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, [configuration]);

  return <div>宽度：{config.width}</div>;
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
