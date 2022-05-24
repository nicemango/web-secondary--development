import React, { Component, useEffect, useState } from "react";
import { Button, Menu } from "antd";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import { user } from "./api/asset";
import history from "./utils/history.js";
// import appService from "@njsdata/app-sdk";
import "./app.less";
import Search from "antd/lib/transfer/search";
import qs from "querystringify";
export const cleanObject = (obj) => Object.entries(obj).reduce((prev, [key, value]) => (value === undefined ? prev : { ...prev, [key]: value }), {});
function stringify(query, suffix) {
  return qs.stringify(cleanObject(query), suffix);
}
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

// const items = [
//   getItem("Navigation One", "sub1", <MailOutlined />, [getItem("Option 1", "1"), getItem("Option 2", "2"), getItem("Option 3", "3"), getItem("Option 4", "4")]),
//   getItem("Navigation Two", "sub2", <AppstoreOutlined />, [
//     getItem("Option 5", "5"),
//     getItem("Option 6", "6"),
//     getItem("Submenu", "sub3", null, [getItem("Option 7", "7"), getItem("Option 8", "8")]),
//   ]),

//   getItem("Navigation Three", "sub4", <SettingOutlined />, [getItem("Option 9", "9"), getItem("Option 10", "10"), getItem("Option 11", "11"), getItem("Option 12", "12")]),
// ]; // submenu keys of first level

const App = (props) => {
  const { customConfig } = props;
  const { componentId, dataSouce, appId } = customConfig || {};
  const toParseDataSouce = JSON.parse(dataSouce);
  const rootSubmenuKeys = [];
  const [userInfo, setUserInfo] = useState({});
  console.log(customConfig, toParseDataSouce);
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
    onlyShowOne(toParseDataSouce);
    userinfo();
    props?.customConfig?.componentId &&
      window.componentCenter?.register(props?.customConfig?.componentId, "", this, {
        events,
        actions,
      });
  }, []);
  const reloadView = (item, key, keyPath, domEvent) => {
    // history.push({ pathname: `view`, search: stringify({ appid: appId, type: "view", menuId: item.key }, true) });
    window?.clickMenu({ key: item.key, isSubMenu: item.children?false:true });
    // window.location.href = `view?appid=${appId}&type=view&menuId=${item.key}`;
  };
  function userinfo() {
    user()
      .then((res) => {
        if (res.status == 200) {
          setUserInfo(res.data);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  }
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const onlyShowOne = (toParseDataSouce) => {
    toParseDataSouce.forEach((item, index) => {
      if (item.key) {
        rootSubmenuKeys.push(item.key);
      }
    });
  };
  const [openKeys, setOpenKeys] = React.useState([toParseDataSouce[0].key]);
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

  return (
    <>
      <div className="userInfo">
        <div className="userInfoLeft">
          <img src={userInfo.photo} className="userHead"></img>
          {/* <img src={require("./assets/header.png").default} style={{ display: userInfo.photo ? "none" : "block" }} className="userHead"></img> */}
        </div>
        <div className="userInfoRight">
          <span>{userInfo.name}</span>
          <span>您好，欢迎使用</span>
        </div>
      </div>
      <div id="customHeadAndSide">
        <Menu
          mode="inline"
          defaultOpenKeys={rootSubmenuKeys}
          onOpenChange={onOpenChange}
          theme="dark"
          onClick={reloadView}
          style={{
            width: 256,
          }}
          items={toParseDataSouce}
        />
      </div>
    </>
  );
};

export default App;
