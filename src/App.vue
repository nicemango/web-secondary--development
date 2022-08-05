<template>
  <div style="width: 100%; height: 100%;position: relative;">
    <!-- <span @click="do_EventCenter_getRow(item)" v-for="item in tableData1"> {{ item.产品订单名称 }}|</span> -->
    <img :src="imgSrc" alt="">
    <div :style="{ fontSize: titleFontSize + 'px', fontFamily: titleFontFamily, color: titleFontColor }"
      class="fontPosition">{{ orderName }}
    </div>
  </div>
</template>

<script>
import { queryAssetById } from "./api/asset";
const zipObject = (arr1, arr2) => {
  const ret = {};
  arr1.forEach((item, index) => {
    ret[item] = arr2[index];
  });
  return ret;
};
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    componentId: {
      type: String | undefined,
      default: "",
    },
    options: {
      type: Object,
      default: () => ({
        // 配置项从externalVariables里取
        externalVariables: {},
      }),
    },
    updateProcess: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    return {
      timer: '',
      tableData1: [],
      imgSrc: require('../images/orderStart.png').default,
      orderStatus: '',
      orderName: '',
      titleFontSize: this.options.externalVariables.titleFontSize ? this.options.externalVariables.titleFontSize : 16,
      titleFontFamily: this.options.externalVariables.titleFontFamily ? this.options.externalVariables.titleFontFamily : '微软雅黑',
      titleFontColor: this.options.externalVariables.titleFontColor ? this.options.externalVariables.titleFontColor : '#fff'
    };
  },
  computed: {
    tableDataHeader() {
      return (this.dataSource[0] || []).map(t => ({
        prop: t,
        label: t,
      }));
    },
    tableData() {
      let [header, ...tableData] = this.dataSource;
      tableData = tableData || [];
      return tableData.map(d => (window?._?.zipObject || zipObject)(header, d));
    },
  },
  mounted() {
    this.getDataInfo()
    this.timer = setInterval(() => {
      this.getDataInfo()
      this.tableData1.forEach(item => {
        if (this.orderName == item.产品订单名称) {
          this.orderStatus = item.订单状态
        }
      })
      this.changeStatus()
      // console.log(1);
    }, 5000)
    const events = [
      // {
      //   key: "onClick",
      //   name: "点击",
      //   payload: [
      //     {
      //       name: "名称",
      //       dataType: "string",
      //       key: "name",
      //     },
      //   ],
      // },
    ];

    const actions = [
      {
        key: "getRow",
        name: "改变状态",
        params: [
          {
            key: "row",
            name: "行信息",
            dataType: "object",
          },
        ],
      },
    ];

    this.componentId &&
      window.componentCenter?.register &&
      window.componentCenter.register(this.componentId, "comp", this, {
        events,
        actions,
      });
    this.updateProcess && this.updateProcess();
  },
  methods: {
    getDataInfo() {
      queryAssetById('98193042-7217-38b3-6db2-27a6c54ee26f').then(res => {
        this.tableData1 = []
        res.data[1].forEach((item, i) => {
          let obj = {
            产品订单名称: item[3],
            订单状态: item[26]
          }
          this.tableData1.push(obj)
        })
        // console.log(this.tableData1);
      })
    },
    all(a) {
      let arr = a
      let arr2 = []
      let headList = arr[0]
      arr.forEach((d, i) => {
        if (i !== 0) {
          let obj = {}
          headList.forEach((item, index) => {
            obj[headList[index]] = arr[i][index]
          })
          arr2.push(obj)
        }
      })
      return arr2
    },
    clickBt() {
      this.componentId &&
        window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.componentId, "onClick", {
          name: "二开插件",
        });
    },
    // 逻辑控制用，不可删，return内容可改
    Event_Center_getName: () => {
      return "成功通";
    },
    do_EventCenter_getRow(param) {
      this.orderStatus = param.row.订单状态
      this.orderName = param.row.产品订单名称
      this.changeStatus()
    },
    changeStatus() {
      switch (this.orderStatus) {
        case '部长初审中':
          this.imgSrc = require('../images/orderStart.png').default;
          break;
        case '厂长审核中':
          this.imgSrc = require('../images/orderCheck.png').default;
          break;
        case '订单确认中':
          this.imgSrc = require('../images/orderQR.png').default;
          break;
        case '订单拆解中':
          this.imgSrc = require('../images/orderCJ.png').default;
          break;
        case '订单开发中':
          this.imgSrc = require('../images/orderDevelop.png').default;
          break;
        case '集成验证中':
          this.imgSrc = require('../images/orderAllCheck.png').default;
          break;
        case '订单验收中':
          this.imgSrc = require('../images/custormQR.png').default;
          break;
        case '已完成':
          this.imgSrc = require('../images/orderOver.png').default;
          break;
        case '部长初审不通过':
          this.imgSrc = require('../images/orderCheck.png').default;
          break;
        case '厂长审核不通过':
          this.imgSrc = require('../images/orderCheck.png').default;
          break;
        case '1':
          this.imgSrc = require('../images/orderStart.png').default;
          break;
        case '2':
          this.imgSrc = require('../images/orderCheck.png').default;
          break;
        case '3':
          this.imgSrc = require('../images/orderQR.png').default;
          break;
        case '4':
          this.imgSrc = require('../images/orderCJ.png').default;
          break;
        case '5':
          this.imgSrc = require('../images/orderDevelop.png').default;
          break;
        case '6':
          this.imgSrc = require('../images/orderAllCheck.png').default;
          break;
        case '7':
          this.imgSrc = require('../images/custormQR.png').default;
          break;
        case '8':
          this.imgSrc = require('../images/orderOver.png').default;
          break;
        case '9':
          this.imgSrc = require('../images/orderCheck.png').default;
          break;
        case '10':
          this.imgSrc = require('../images/orderCheck.png').default;
          break;
        default:
          this.imgSrc = require('../images/orderStart.png').default;
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  }
};
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}

img {
  width: 100%;
  height: 100%;
}

.fontPosition {
  position: absolute;
  top: 0;
  left: 40px;
}
</style>
