import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Input, Select, Option, Button, Avatar, Tree, Tag, Dialog, Message} from "element-ui";

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Avatar);
Vue.use(Tree);
Vue.use(Tag);
Vue.use(Dialog);

Vue.prototype.$message = Message;
// import * as appService from "@njsdata/app-sdk";

if (process.env.NODE_ENV !== "production") {
  // 添加 customConfig 进行测试
  let customConfig = {
    筛选对应key:'name',
    筛选对应name:'device_name',
    系统变量对应name:'create_member',
  };
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
