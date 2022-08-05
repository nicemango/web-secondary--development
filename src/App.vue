<template>
  <div class="rongyun_ue" :style="{ width: '100%', height: '100%' }">
    <div class="video_btn">
      <el-button-group>
        <el-button type="info" icon="el-icon-zoom-in" @click="appZoom"></el-button>
        <el-button type="info" @click="appSetRes(1280,720)">720P</el-button>
        <el-button type="info" @click="appSetRes(1920, 1080)">1080P</el-button>
        <el-button type="info" @click="appSetRes(3840, 2160)">4K</el-button>
      </el-button-group>
      <el-select style="margin-left: 15px" v-model="bandvalue" placeholder="Bandwidth Cap" @change="bandChange">
        <el-option
          v-for="item in bandOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="framerateValue" placeholder="Framerate Cap" @change="frameChange">
        <el-option
          v-for="item in framerateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div id="player"></div>
  </div>
</template>

<script>
import '../src/player.css'
import load from "../scripts/load.js"
// import webRtc from "../scripts/webRtcPlayer.js"
// load,
// zoom,
// setRes,
// setBandwidthCap,
// setFramerateCap,
export default {
  name: "App",
  props: {
    customConfig: Object,
    options: Object,
  },
  data: function () {
    return {
      WebSocketIp: "",
      bandvalue: "",
      framerateValue: "",
      bandOptions: [
        {
          value: 0.5,
          label: 'Bandwidth Cap 0.5 Mbps'
        },
        {
          value: 1,
          label: 'Bandwidth Cap 1 Mbps'
        },
        {
          value: 2,
          label: 'Bandwidth Cap 2 Mbps'
        },
        {
          value: 3,
          label: 'Bandwidth Cap 3 Mbps'
        },
        {
          value: 4,
          label: 'Bandwidth Cap 4 Mbps'
        },
        {
          value: 5,
          label: 'Bandwidth Cap 5 Mbps'
        },
        {
          value: 6,
          label: 'Bandwidth Cap 6 Mbps'
        },
        {
          value: 7,
          label: 'Bandwidth Cap 7 Mbps'
        },
        {
          value: 8,
          label: 'Bandwidth Cap 8 Mbps'
        },
        {
          value: 10,
          label: 'Bandwidth Cap 10 Mbps'
        },
        {
          value: 15,
          label: 'Bandwidth Cap 15 Mbps'
        },
        {
          value: 20,
          label: 'Bandwidth Cap 20 Mbps'
        },
        {
          value: 30,
          label: 'Bandwidth Cap 30 Mbps'
        },
        {
          value: 50,
          label: 'Bandwidth Cap 50 Mbps'
        },
        {
          value: 60,
          label: 'Bandwidth Cap 60 Mbps'
        }
      ],
      framerateOptions: [
        {
          value: 5,
          label: 'Framerate Cap 5 fps'
        },
        {
          value: 10,
          label: 'Framerate Cap 10 fps'
        },
        {
          value: 15,
          label: 'Framerate Cap 15 fps'
        },
        {
          value: 20,
          label: 'Framerate Cap 20 fps'
        },
        {
          value: 25,
          label: 'Framerate Cap 25 fps'
        },
        {
          value: 30,
          label: 'Framerate Cap 30 fps'
        },
        {
          value: 40,
          label: 'Framerate Cap 40 fps'
        },
        {
          value: 50,
          label: 'Framerate Cap 50 fps'
        },
        {
          value: 60,
          label: 'Framerate Cap 60 fps'
        },
        {
          value: 0,
          label: 'Framerate Cap Unlimited'
        },
      ]
    };
  },
  computed: {},
  watch: {},
  created() {
    const pubSub = this.customConfig.pubSub;
    pubSub && pubSub.subscribe("updateChart" + this.customConfig.componentId,(data) => {});
  },
  mounted() {
    // let wsUrl = 'ws://10.15.111.24:90/';
    let wsUrl = this.options?.externalVariables.WSIp;
    this.WebSocketIp = wsUrl;
    console.log('wsUrl',wsUrl);
    console.log('wsUrl',wsUrl);

    load.load(wsUrl);
    const events = [];
    const actions = [];
    window.componentCenter?.register &&
      window.componentCenter.register(
        this.customConfig.componentId,
        "comp",
        this,
        {
          events,
          actions,
        }
      );
    this.customConfig?.updateProcess && this.customConfig.updateProcess();
  },

  methods: {
    Event_Center_getName: () => {
      return "";
    },
    do_EventCenter_messageSuccess: function (param) {
      console.log(param);
      alert("动作执行成功！");
    },
    // clickbt: function () {
    //   console.log("clickbt");
    //   window.eventCenter?.triggerEvent &&
    //     window.eventCenter.triggerEvent(
    //       this.customConfig.componentId,
    //       "onClick",
    //       {
    //         name: "二开插件",
    //       }
    //     );
    // },
    appZoom(){
      load.zoom();
    },
    appSetRes(a,b){
      load.setRes(a,b);
    },
    bandChange(val) {
      console.log(val)
      load.setBandwidthCap(val);
    },
    frameChange(val) {
      console.log(val)
      load.setFramerateCap(val);
    }
  },
};
</script>

<style lang="less" scoped>
:root {
	/*Using colour scheme https://color.adobe.com/TD-Colors---Option-3-color-theme-10394433/*/
	--colour1:#2B3A42;
	--colour2:#3F5765;
	--colour3:#BDD4DE;
	--colour4:#EFEFEF;
	--colour5:#FF5035;
	
	--buttonFont:Helvetica;
	--inputFont:Helvetica;
}
.rongyun_ue {
  background: #fff;

  .video_btn {
    display: flex;
    width: 100%;
  }

  // #player {
  //   position: relative;
  //   margin-top: 10px;
  //   width: 100%;
  //   height: 100%;
  //   z-index: 10;
  // 	background-color: #000;


  //   #videoPlayOverlay{
  //     z-index: 30;
  //     position: absolute;
  //     color: var(--colour4);
  //     font-size: 1.8em;
  //     font-family: var(--inputFont);
  //     width: 100%;
  //     height: 100%;
  //     background-color: rgba(100, 100, 100, 0.7);
  //   }

  //   video{
  //     position: absolute;
  //     width: 100%;
  //     height: 100%;
  //   }
  // }
}
</style>
