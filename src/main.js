import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import { Input, Form, FormItem, Select, Option, Loading } from "element-ui";
import "./index.css";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;

Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Loading);

// Vue.use(Element);

if (process.env.NODE_ENV !== "production") {
  const appArr = [
    { title: "列表页", type: "list" },
    // { title: "配置项", type: "designConfiguration" },
  ];

  const customConfig = {
    // 列数据
    columns: [],
    // 行数据
    data: [],
    // 配置项
    configuration: {
      timeStep: 'date',
      formID: 'd6151f19-333d-43d1-b362-b2b8d0dc60ba',
      deleteKey: 'f78a5ef2-bacb-48cf-9daa-c8e46e429711',
      taskMappingField: 'belongProject',
      taskID: 'c5f025c8-3e30-419c-a02e-01e157a86bd4',
      taskField: '项目名称: {{taskName}}',
    },
  };

  new Vue({
    render: h => {
      return (
        <div class="app-container">
          {appArr.map((item, index) => {
            return (
              <div class="components">
                <span class="title">{item.title}:</span>
                <App
                  style={{ width: "calc(100% - 220px)" }}
                  customConfig={customConfig}
                  type={item.type}
                />
              </div>
            );
          })}
        </div>
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
          render: h => <App platformProps={ {...props} }/>,
        }).$mount(div);

      props.setSetPluginProps((props)=>{
        if (dom.childNodes.length > 0) {
          dom.removeChild(dom.childNodes[0]);
        }
        const divs = document.createElement("div");
        dom.appendChild(divs);
        new Vue({
          render: h => <App platformProps={ {...props} }/>,
        }).$mount(divs);
      })
    }
  );
}
