import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Input, Select, Option, Button, Avatar, Steps, Step } from "element-ui";

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Avatar);
Vue.use(Steps);
Vue.use(Step);

// import * as appService from "@njsdata/app-sdk";

if (process.env.NODE_ENV !== "production") {
  // 添加 customConfig 进行测试
  let customConfig = {
    dataSouce: [
    {
      title: '步骤1',
      description: '213459874651236584856',
      status: 'wait'
    },
    {
      title: '步骤2',
      description: '213459874651236584856',
      status: 'wait'
    },
    {
      title: '步骤3',
      description: '213459874651236584856',
      status: 'wait'
    },
    {
      title: '步骤4',
      description: '213459874651236584856',
      status: 'wait'
    },
    {
      title: '步骤5',
      description: '213459874651236584856',
      status: 'wait'
    },
    {
      title: '步骤6',
      description: '213459874651236584856',
      status: 'wait'
    },
    {
      title: '步骤7',
      description: '213459874651236584856',
      status: 'wait'
    }
  ]
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
