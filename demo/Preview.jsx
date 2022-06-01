import React from "react";
import App from "../src/App";
function initWindows() {
  window.__bigScreen_options = {
    auto: true,
    showToolbar: false,
    columns: ["年份", "数值", "指标名称"],
    showColumns: ["指标名称", "数值"],
    dataSourceType: 2,
    customCss: "",
  };

  window.__bigScreen_data = [
    [2018, 3.9, "新生儿死亡率"],
    [2018, 6.1, "婴儿死亡率"],
    [2018, 8.4, "5岁以下儿童死亡率"],
  ];
}
initWindows();
window.__bigScreen_variable = {
  default_value: "变量",
  id: "变量ID",
};
const Preview = (props) => {
  return <App></App>;
};

Preview.propTypes = {};

export default Preview;
