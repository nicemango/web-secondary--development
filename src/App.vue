<template>
  <div style="height: 100%; width: 100%;">
    <el-steps direction="vertical" :active="this.tableData.length + 1" space="10%" class="steps">
      <el-step v-for="item in tableData" :key="item.title" :title="(item.title)" :description="(item.description)"
        :status="(item.status)"></el-step>
      <el-step style="display:none" ref="iite"></el-step>
    </el-steps>
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
  },
  data() {
    return {
      tableData: this.customConfig.dataSouce
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
  mounted() {
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    let a = this.$refs.iite
    this.$nextTick(() => {
      console.log(a);
      this.tableData[a.index - 1].status = 'finish'
    });
  },
  methods: {
    goToStudy() {
      // window.open(this.customConfig?.url || "http://baidu.com");
    },
    getData() {
      //   console.log(appService.getMenuData(), "菜单");
      //   console.log(appService.getPageData(), "页面");
      //   console.log(appService.getVariable(), "变量");
    },
    triggerEvent() {
      // let { componentId, appId } = this.customConfig || {};
      // componentId &&
      //   appId &&
      //   window.eventCenter?.triggerEventNew({
      //     objectId: appId,
      //     componentId: componentId,
      //     type: "app",
      //     event: "onImgClick",
      //     payload: {
      //       value: "sasdasd",
      //     },
      //   });
    },
    do_EventCenter_messageSuccess() {
      alert("动作执行成功！");
    },
    Event_Center_getName() {
      return "滨海-时间轴";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
<style scoped>
.steps {
  display: flex;
  flex-direction: column-reverse;
}
</style>
