import Vue from "vue";
import App from "./App.vue";
// 按需引入组件，引入方式见https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru
import {
  Input,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Pagination,
  Checkbox
} from "element-ui";

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Select);
Vue.use(Checkbox);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);

if (process.env.NODE_ENV !== "production") {
  // 添加 customConfig 进行测试
  let customConfig = {
    title: "技术服务委托",
    buttonTitle: '新增委托',
    tableDisplayFieldName: "name,sex",
    assetId: "db5d25a6-b167-4ead-b7eb-ef6510f3b7ee",
    selectAssetId: "3ff309d4-1b34-498d-9c60-8d478f1f43a7",
    inputSelectConfig: JSON.stringify({
      input: ['name', 'age'], select: [
        {
          displayField: 'sex', valueField: 'sex'
        }, {
          displayField: 'name', valueField: 'name'
        }
      ]
    }),
    data: JSON.parse('[["资产名称","目录"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有农村资产","是11111111国有"],["国有城镇资产资产","是222222国有"],["私有城镇资产","是11111私有"]]'),
    dataTwo: JSON.parse('[["资产名称22222","目录"],["国有农村资产222222","是11111111国有"],["国有城镇资产资产222222","是222222国有"],["私有城镇资产222222","是11111私有"]]')
  };
  new Vue({
    render: h => {
      return <App customConfig={customConfig}/>;
    },
  }).$mount("#app");
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }

  window.CUSTOM_PLUGIN.set(process.env.VUE_APP_CUSTOM_PLUGIN_ID, (dom, props) => {
    const customConfig = (props && props.customConfig) || {};
    const component = new Vue({
      render: h => <App customConfig={customConfig} info={props}/>,
    }).$mount();
    if (dom.childNodes.length > 0) {
      dom.removeChild(dom.childNodes[0]);
    }
    dom.appendChild(component.$el);
  });
}
