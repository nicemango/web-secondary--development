<template>
  <div class="live_btn">
    <div class="btn_box" @click="dialogShow"></div>
    <el-dialog
      :title="videoItem.deviceName"
      :visible.sync="dialogVisible"
      :width="videoWidth"
      :modal="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :before-close="handleClose">
      <div class="dia_content">
        <video ref="videoEl" id="videoEl" poster="" class="centeredVideo" controls @click="videoClick"></video>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { normalizeData } from "./normalizeData";
import { queryLiveing } from "./api/asset";
import mpegts from "mpegts.js"
export default {
  name: "App",
  props: {
    customConfig: Object,
    options: Object,
  },
  data: function () {
    return {
      rowId: "",
      dialogVisible: false, // 弹窗显示
      // 直播数据
      videoItem: {
        deviceId: "",
        deviceName: "",
        expireTime: "",
        protocolCode: "",
        url: "",
      },
      videoEl: {}, // video标签
      flvPlayer: null, // flv对象
      videoWidth: "",
    };
  },
  computed: {
    // data: function () {
    //   return this.customConfig.data || [];
    // },
    // options: function () {
    //   return this.customConfig.options || [];
    // },
    // variable: function () {
    //   return this.customConfig.variable || [];
    // },
    // customConfigClone: function () {
    //   return JSON.stringify(this.customConfig);
    // },
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
    this.videoWidth = this.options?.externalVariables.videoWidth + "px";
    console.log('videoWidth======',this.videoWidth);

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
    initFlv(){
      if (mpegts.isSupported()) {
        this.videoEl = {};
        this.flvPlayer = null;
        // this.videoEl = this.$refs.videoEl;
        this.videoEl = document.getElementById('videoEl')
        mpegts.LoggingControl.forceGlobalTag = true;
        this.flvPlayer = mpegts.createPlayer(
          {
            type: 'flv',
            isLive: true,
            url: this.videoItem.url
          },
          {
            autoCleanupSourceBuffer: true // 是否自动清理缓存
          }
        )
        
        this.flvPlayer.attachMediaElement(this.videoEl)
        this.flvPlayer.load()
        this.flvPlayer.play()

        if (this.videoEl.paused === true) {
          this.flvPlayer.unload()
          this.flvPlayer.detachMediaElement()
        }
        
        // 监听错误事件
        this.flvPlayer.on(mpegts.Events.ERROR, (err, errdet) => {
          // 参数 err 是一级异常，errdet 是二级异常
          if (err == mpegts.ErrorTypes.MEDIA_ERROR) {
            console.log('媒体错误')
            if (this.flvPlayer) this.flv_destroy();
            if(errdet == mpegts.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED) {
              console.log('媒体格式不支持')
            }
          }
          if (err == mpegts.ErrorTypes.NETWORK_ERROR) {
            console.log('网络错误')
            if (this.flvPlayer) this.flv_destroy();
            if(errdet == mpegts.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
              console.log('http状态码异常')
            }
          }
          if(err == mpegts.ErrorTypes.OTHER_ERROR) {
            console.log('其他异常：', errdet)
            if (this.flvPlayer) this.flv_destroy();
          }
        })
      }
    },
    // 销毁flv
    flv_destroy() {
      if (this.videoEl.paused === false) {
        this.flvPlayer.pause();
        this.flvPlayer.unload();
        this.flvPlayer.detachMediaElement();
      }
      if (this.flvPlayer != null) this.flvPlayer.destroy();
      this.flvPlayer = null;
      this.videoEl = {};
    },
    // 弹窗关闭
    handleClose(done) {
      // 销毁直播
      this.flv_destroy();
      done();
    },
    // 弹窗显示
    dialogShow(it) {
      this.queryLiveings();
      this.dialogVisible = true;
    },
    videoClick(){
      if (this.videoEl.paused === true) {
        // 已断流，重新拉流播放
        this.flvPlayer.attachMediaElement(this.videoEl)
        this.flvPlayer.load()
        this.flvPlayer.play()
        // this.videoEl.play();
      }else {
        this.flvPlayer.unload()
        this.flvPlayer.detachMediaElement()
      }
    },
    // 直播请求
    async queryLiveings() {
      await queryLiveing("888d40c0299348a280a00feb33c66cc5").then(res=>{
        this.videoItem = res.data;
        this.videoItem.deviceName = this.videoItem.deviceName == "" ? "直播弹窗" : this.videoItem.deviceName;
        this.initFlv();
      }).catch(err=>{
        this.videoItem = {
          deviceId: "",
          deviceName: "暂无直播画面",
          expireTime: "",
          protocolCode: "",
          url: "",
        }
        this.videoEl = {};
        this.flvPlayer = null;
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
/deep/.el-dialog {
  background: rgba(7, 28, 61, 0.8);
  border-radius: 0;
  .el-dialog__header {
    padding: 10px 10px 0;

    .el-dialog__title {
      font-size: 16px;
      color: #fff;
    }
    .el-dialog__headerbtn{
      top: 14px;
      .el-dialog__close {
        color: #fff !important;
      }
    }
  }
  .el-dialog__body {
    padding: 10px 10px;

    .dia_content {
      display: flex;
      flex-direction: column;
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
      video::-webkit-media-controls-mute-button {
        display: none;
      }
      // video::-webkit-media-controls-toggle-closed-captions-button {
      //   display: none;
      // }
      /* 音量的控制条 */
      video::-webkit-media-controls-volume-slider {
        display: none;
      }
      /*  播放按钮 */
      video::-webkit-media-controls-play-button {
        display: none;
      }
    }
  }
}
.live_btn {
  width: 100%;
  height: 100%;
  .btn_box {
    -moz-user-select: none;
    -o-user-select:none;
    -khtml-user-select:none;
    -webkit-user-select:none;
    -ms-user-select:none;
    user-select:none;
    width: 100%;
    height: 100%;
    border: 2px solid pink;
  }

  // /deep/.el-dialog {
  //   background: rgba(7, 28, 61, 0.8);
  //   border-radius: 0;
  //   .el-dialog__header {
  //     padding: 10px 10px 0;

  //     .el-dialog__title {
  //       font-size: 16px;
  //       color: #fff;
  //     }
  //     .el-dialog__headerbtn{
  //       top: 14px;
  //       .el-dialog__close {
  //         color: #fff !important;
  //       }
  //     }
  //   }
  //   .el-dialog__body {
  //     padding: 10px 10px;

  //     .dia_content {
  //       display: flex;
  //       flex-direction: column;
  //       .centeredVideo {
  //         display: block;
  //         width: 100%;
  //         height: 100%;
  //         background: #333;
  //       }
  //       /* 控件 */
  //       // video::-webkit-media-controls-enclosure {
  //       //   display: none;
  //       // }
  //       /* 进度条 */
  //       video::-webkit-media-controls-timeline {
  //         display: none;
  //       }
  //       video::-webkit-media-controls-current-time-display {
  //         display: none;
  //       }
  //       /* 音量按钮 */
  //       video::-webkit-media-controls-mute-button {
  //         display: none;
  //       }
  //       // video::-webkit-media-controls-toggle-closed-captions-button {
  //       //   display: none;
  //       // }
  //       /* 音量的控制条 */
  //       video::-webkit-media-controls-volume-slider {
  //         display: none;
  //       }
  //       /*  播放按钮 */
  //       video::-webkit-media-controls-play-button {
  //         display: none;
  //       }
  //     }
  //   }
  // }
}
</style>
