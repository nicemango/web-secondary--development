import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Menu, MenuItem, MenuItemGroup, Submenu, Row, Col, Badge } from "element-ui";

Vue.config.productionTip = false;
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Submenu);
Vue.use(Row);
Vue.use(Col);
Vue.use(Badge);

// import * as appService from "@njsdata/app-sdk";

if (process.env.NODE_ENV !== "production") {
  // 添加 customConfig 进行测试
  let customConfig = {};

  new Vue({
    render: h => {
      return <App customConfig={customConfig} />;
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
