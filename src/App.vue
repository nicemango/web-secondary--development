<template>
  <div class="live_box">
    <video ref="videoLive" id="videoLive" poster="" class="centeredVideo" muted controls @click="mpegtsClick"></video>
  </div>
</template>

<script>
import { queryLiveing } from "./api/asset";
import mpegtFlvs from "mpegts.js"
export default {
  name: "App",
  props: {
    customConfig: Object,
  },
  data: function () {
    return {
      // 直播数据
      videoItems: {
        deviceId: "",
        deviceName: "",
        expireTime: "",
        protocolCode: "",
        url: "",
      },
      videoLive: {}, // video标签
      mpegtsPlayer: null, // flv对象
    };
  },
  computed: {
    data: function () {
      return this.customConfig.data || [];
    },
    options: function () {
      return this.customConfig.options || [];
    },
    variable: function () {
      return this.customConfig.variable || [];
    },
    customConfigClone: function () {
      return JSON.stringify(this.customConfig);
    },
  },
  watch: {
    // customConfigClone: (newval) => {
    //   console.log("customConfigChange", customConfigClone);
    //   this.initChart(this.variable, this.options, this.data);
    // },
    // data: (newvalue) => {
    //   console.log("dataChange", newvalue);
    //   this.initChart(this.variable, this.options, this.data);
    // },
    // variable: (newvalue) => {
    //   console.log("variableChange", newvalue);
    //   this.initChart(this.variable, this.options, this.data);
    // },
    // options: (newvalue) => {
    //   console.log("optionsChange", newvalue);
    //   this.initChart(this.variable, this.options, this.data);
    // },
  },
  created() {
    const pubSub = this.customConfig.pubSub;
    pubSub &&
      pubSub.subscribe(
        "updateChart" + this.customConfig.componentId,
        (data) => {
          console.log("updateChart");
        }
      );
  },
  mounted() {
    this.getLiveings();

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
    // 初始化直播窗口
    initMpegts(){
      if (mpegtFlvs.isSupported()) {
        this.videoLive = {};
        this.mpegtsPlayer = null;
        // this.videoLive = this.$refs.videoLive;
        this.videoLive = document.getElementById('videoLive')
        mpegtFlvs.LoggingControl.forceGlobalTag = true;
        this.mpegtsPlayer = mpegtFlvs.createPlayer(
          {
            type: 'flv',
            isLive: true,
            url: this.videoItems.url
          },
          {
            autoCleanupSourceBuffer: true // 是否自动清理缓存
          }
        )
        
        this.mpegtsPlayer.attachMediaElement(this.videoLive)
        this.mpegtsPlayer.load()
        this.mpegtsPlayer.play()

        if (this.videoLive.paused === true) {
          this.mpegtsPlayer.unload()
          this.mpegtsPlayer.detachMediaElement()
        }
        
        // 监听错误事件
        this.mpegtsPlayer.on(mpegtFlvs.Events.ERROR, (err, errdet) => {
          // 参数 err 是一级异常，errdet 是二级异常
          if (err == mpegtFlvs.ErrorTypes.MEDIA_ERROR) {
            console.log('媒体错误')
            if (this.mpegtsPlayer) this.mpegts_destroy();
            if(errdet == mpegtFlvs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED) {
              console.log('媒体格式不支持')
              if (this.mpegtsPlayer) this.mpegts_destroy();
            }
          }
          if (err == mpegtFlvs.ErrorTypes.NETWORK_ERROR) {
            console.log('网络错误')
            if (this.mpegtsPlayer) this.mpegts_destroy();
            if(errdet == mpegtFlvs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
              console.log('http状态码异常')
              if (this.mpegtsPlayer) this.mpegts_destroy();
            }
          }
          if(err == mpegtFlvs.ErrorTypes.OTHER_ERROR) {
            console.log('其他异常：', errdet)
            if (this.mpegtsPlayer) this.mpegts_destroy();
          }
        })
      }
    },
    // 销毁flv
    mpegts_destroy() {
      if (this.videoLive.paused === false) {
        this.mpegtsPlayer.pause();
        this.mpegtsPlayer.unload();
        this.mpegtsPlayer.detachMediaElement();
      }
      if (this.mpegtsPlayer != null) this.mpegtsPlayer.destroy();
      this.mpegtsPlayer = null;
      this.videoLive = {};
    },
    mpegtsClick(){
      if (this.videoLive.paused === true) {
        // 已断流，重新拉流播放
        this.mpegtsPlayer.attachMediaElement(this.videoLive)
        this.mpegtsPlayer.load()
        this.mpegtsPlayer.play()
      }else {
        this.mpegtsPlayer.unload()
        this.mpegtsPlayer.detachMediaElement()
      }
    },
    // 直播请求
    async getLiveings() {
      await queryLiveing("888d40c0299348a280a00feb33c66cc5").then(res=>{
        this.videoItems = res.data;
        this.initMpegts();
      }).catch(err=>{
        this.videoItems = {
          deviceId: "",
          deviceName: "",
          expireTime: "",
          protocolCode: "",
          url: "",
        }
        this.videoLive = {};
        this.mpegtsPlayer = null;
        // this.$message.error('直播接口：'+err.status +` - `+ err.statusText)
      })
    },
    
    Event_Center_getName: () => {
      return "Demo实例";
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
  },
};
</script>

<style lang="less" scoped>
.live_box {
  width: 100%;
  height: 100%;
  .centeredVideo {
    display: block;
    width: 100%;
    height: 100%;
    background: #333;
  }
  /* 控件 */
  // video::-webkit-media-controls-enclosure {
  //   display: none;
  // }
  /* 进度条 */
  video::-webkit-media-controls-timeline {
    display: none;
  }
  video::-webkit-media-controls-current-time-display {
    display: none;
  }
  /* 音量按钮 */
  // video::-webkit-media-controls-mute-button {
  //   display: none;
  // }
  /* 音量的控制条 */
  // video::-webkit-media-controls-volume-slider {
  //   display: none;
  // }
  /*  播放按钮 */
  video::-webkit-media-controls-play-button {
    display: none;
  }
    // video::-webkit-media-controls-toggle-closed-captions-button {
    //   display: none;
    // }
}
</style>
