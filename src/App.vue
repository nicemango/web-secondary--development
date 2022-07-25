<template>
  <div style="height: 100%; width: 100%;">
  <div  class="setp-header" >法律状态</div>
  <div class="setp_main">
 <el-steps direction="vertical" :active="this.tableData.length + 1" space="10%" class="steps">
      <el-step v-for="item in tableData" :key="item.title" :title="(item.title)" :description="(item.description)"
        :status="(item.status)"  ></el-step>
      <el-step style="display:none" ref="iite"></el-step>
    </el-steps>
  </div>
   
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
   
    }
  },
  computed: {
    title() {
      return this.customConfig?.title || "数据构建";
    },
    desc() {
      return this.customConfig?.desc || "描述";
    },
    tableData(){
      let tempData=null
      try {
        tempData=  JSON.parse(this.customConfig.dataSouce)
      } catch (error) {
         tempData=[   {
      "title": '2021-11-16',
      "description": '公开',
      "status": 'wait'
    },
    {
      "title": '2021-12-03',
      "description": '实质审查的生效',
      "status": 'wait'
    },
    {
      "title": '2022-02-22',
      "description": '授权',
      "status": 'wait'
    },
    {
      "title": '2022-03-15',
      "description": '专利申请权、专利权的转移',
      "status": 'finish'
    }
   ]
      }
      return  tempData
    }
  },
  mounted() {
    console.log(this.tableData,'===============');
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
<style lang="less"   scoped>
.steps {
  display: flex;
  flex-direction: column-reverse;
  font-size: 16px;   
   
}
.setp-header{
  padding:10px 0;
  font-weight: 900;
  font-size: 18px;
  color:#111111;
  // margin-bottom:-20px
}

 /deep/ .is-finish{
        color:#2c88d3 ;
  }
      /deep/   .el-step__main{
        .is-wait{
 color:#464646
        }
       
       }
  /deep/ .el-step__head.is-wait{
    color:#9e9e9e
  }
  /deep/.el-step__main .is-finish{
    color:#464646
  }
  /deep/ .el-step__line{
    border-color:#9e9e9e
  }
</style>
