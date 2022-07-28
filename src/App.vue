<template>
  <div class="date_pick">
    <el-date-picker v-model="value" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" @change="testFn"
      :default-time="['00:00:00', '23:59:59']">
    </el-date-picker>
    <!-- <div class="card-title" @click="triggerEvent">
      {{ title }}
    </div>
    <div class="card-desc">
      {{ desc }}
    </div>
    <el-button ghost @click="goToStudy"> 去学习 </el-button>
    <el-button ghost @click="getData"> 获取数据 </el-button> -->
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";

import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
export default {
  name: "App",
  props: {
    customConfig: Object,
    info: Object,
    appVariables: Array
  },
  data() {
    return {
      value: null
    }
  },
  computed: {
    title() {
      return this.customConfig?.title || "数据构建";
    },
    desc() {
      return this.customConfig?.desc || "描述";
    },
  },
  created() {
  },
  mounted() {
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );

  },
  methods: {
    testFn() {
      // console.log(this.value);
      this.selectDateEvent()
    },
    goToStudy() {
      window.open(this.customConfig?.url || "http://baidu.com");
    },
    getData() {
      //   console.log(appService.getMenuData(), "菜单");
      //   console.log(appService.getPageData(), "页面");
      //   console.log(appService.getVariable(), "变量");
    },
    triggerEvent() {
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEventNew({
          objectId: appId,
          componentId: componentId,
          type: "app",
          event: "onImgClick",
          payload: {
            value: "sasdasd",
          },
        });
    },
    selectDateEvent() {
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEventNew({
          objectId: appId,
          componentId: componentId,
          type: "app",
          event: "onSelectClick",
          payload: {
            date: [this.value[0].getTime(), this.value[1].getTime()],
          },
        });
    },
    do_EventCenter_messageSuccess() {
      alert("动作执行成功！");
    },
    Event_Center_getName() {
      return "达远健康日期筛选";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
