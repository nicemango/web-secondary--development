import React, { Component, useEffect } from "react";
import { Button, Menu } from "antd";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
// import appService from "@njsdata/app-sdk";
import "./app.less";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("案件登记", "sub1", <MailOutlined />),
  getItem("案件上报", "sub2", <AppstoreOutlined />),
  getItem("移动上报", "sub4", <SettingOutlined />),
  getItem("核实案件", "sub5", <SettingOutlined />),
  getItem("自行处置", "sub6", <SettingOutlined />),
  getItem("核实反馈", "sub7", <SettingOutlined />),
  getItem("园林上报", "sub8", <SettingOutlined />),
  getItem("市政上报", "sub9", <SettingOutlined />),
]; // submenu keys of first level

const rootSubmenuKeys = ["sub1", "sub2", "sub4"];

const App = (props) => {
  console.log(props);
  const [openKeys, setOpenKeys] = React.useState(["sub1"]);
  useEffect(() => {
    const events = [
      {
        key: "jumpButton",
        name: "跳转按钮",
        payload: [],
      },
    ];
    const actions = [
      {
        key: "messageSuccess",
        name: "刷新页面",
      },
    ];
    props?.customConfig?.componentId &&
      window.componentCenter?.register(props?.customConfig?.componentId, "", this, {
        events,
        actions,
      });
  }, []);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const onClick = (e) => {
    console.log("click ", e);
  };
  const do_EventCenter_messageSuccess = () => {
    window.location.reload();
  };

  // 逻辑控制用，不可删
  const Event_Center_getName = () => {
    return "应用二开测试";
  };
  const { customConfig } = props;
  const { componentId, uesrHead } = customConfig || {};
  return (
    <>
      <div className="userInfo">
        <div className="userInfoLeft">
          <img src={uesrHead} style={{ display: uesrHead ? "block" : "none" }} className="userHead"></img>
          <img src={require("./assets/header.png").default} style={{ display: uesrHead ? "none" : "block" }} className="userHead"></img>
        </div>
        <div className="userInfoRight">
          <span>管理员2</span>
          <span>您好，欢迎使用</span>
        </div>
      </div>
      <div id="customHeadAndSide">
        <Menu
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          theme="dark"
          style={{
            width: 256,
          }}
          items={items}
        />
      </div>
    </>
  );
};

export default App;
