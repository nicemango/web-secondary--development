import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Input, Select, Option, Dialog } from "element-ui";
import echarts from "echarts";

import "./index.css";
Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Select);
Vue.use(Dialog);
Vue.use(Option);
Vue.prototype.$echarts = echarts;

if (process.env.NODE_ENV !== "production") {
  const customConfig = {
    variable: { default_value: "测试的数据", id: "测试的ID" },
    options: {
      auto: true,
      showToolbar: false,
      columns: ["年份", "数值", "指标名称"],
      showColumns: ["指标名称", "数值"],
      dataSourceType: 2,
      customCss: "",
    },
    data: [
      [2018, 3.9, "新生儿死亡率"],
      [2018, 6.1, "婴儿死亡率"],
      [2018, 8.4, "5岁以下儿童死亡率"],
    ],
  };

  new Vue({
    render: h => {
      return (
        <App
          style={{ width: "calc(100% - 220px)" }}
          customConfig={customConfig}
        />
      );
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(
    process.env.VUE_APP_CUSTOM_PLUGIN_ID,
    (dom, props) => {
      if (dom.childNodes.length > 0) {
        dom.removeChild(dom.childNodes[0]);
      }
      const div = document.createElement("div");
      dom.appendChild(div);
      new Vue({
        render: h => <App {...{ props }} />,
      }).$mount(div);
    }
  );
}
