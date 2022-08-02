<template>
  <div class="monitoring_page">
    <div class="left_box">
      <div class="left_box_title">设备列表</div>
      <el-input placeholder="请输入内容" suffix-icon="el-icon-search" v-model="searchWords" @change="inputChange"> </el-input>
      <!-- <el-tree icon-class="el-icon-arrow-right" :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
      <div class="list-box">
        <div class="list_title" v-for="item in equipmentfilterData" :key="item.device_id" :class="{ 'list-active': activeClass == item.device_id }" @click="selectOne(item)">
          {{ item.device_name }}
        </div>
      </div>
    </div>
    <div class="center_box">
      <div class="video_title">
        <span class="title">{{ selectItem.device_name }}</span>
        <el-tag v-if="selectItem.type" :type="selectItem.type" size="medium">{{ selectItem.typeCon }}</el-tag>
      </div>
      <video ref="videoEl" id="videoEl" poster="" class="centeredVideo" controls @click="videoClick"></video>
    </div>
    <div class="right_box">
      <div class="right_box_title">事件列表</div>
      <div id="lineBox" class="line_box">
        <div class="line_item" v-for="(it, index) in alarmFilterData" :key="index">
          <div class="left_con">
            <div class="pot"></div>
            <div class="pot_line" v-show="alarmFilterData.length - 1 > index"></div>
          </div>
          <div class="center_con">
            <div class="center_title">{{ moments(it.reportTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
            <div class="center_text">{{ it.alarm_content }}</div>
          </div>
          <div class="right_con" @click="dialogShow(it)">详情</div>
        </div>
      </div>
    </div>
    <el-dialog :title="selectItem.device_name" :visible.sync="dialogVisible" width="500" :before-close="handleClose">
      <div class="dia_content">
        <img v-if="diaContent.picUrl" class="event_img" :src="diaContent.picUrl" alt="" />
        <span class="event_con">事件：{{ diaContent.alarm_content }}</span>
        <span class="event_con">时间：{{ moments(diaContent.reportTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
        <span class="event_con">点位：{{ selectItem.device_name }}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import flvjs from "flv.js";
import "./index.css";
import moment from "moment";

import { queryAssetById, queryLiveing, queryWarnPicture } from "./api/asset";
export default {
  name: "App",
  props: {
    customConfig: Object,
    sysVariables: Object,
  },
  data() {
    return {
      moments: moment,
      temp: null,
      activeClass: "", // 设备列表选中样式
      searchWords: "", // 搜索字段
      selectItem: {}, // 选中设备
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
      equipmentData: [], // 设备列表
      equipmentfilterData: [], // 设备列表
      alarmData: [], // 事件列表
      alarmFilterData: [], // 事件列表
      dialogVisible: false, // 弹窗显示
      diaContent: {}, // 弹窗信息
      eventPageSize: "30",
      eventPageNum: 1,
      equipmentPageSize: "99999",
      equipmentPageNum: 1,
      shijiandezhi: {
        name: "水表|消防泵房水表",
        zzz: 111,
      },
    };
  },
  computed: {},
  mounted() {
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    this.queryAsset(); // 设备数据
    window.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    // 搜索
    inputChange(val) {
      this.searchWords = val;
      this.equipmentfilterData = this.equipmentData.filter((x) => {
        return x.device_name.includes(val.toString());
      });
    },
    // 选中设备
    selectOne(val) {
      console.log("this.activeClass1", this.activeClass);
      if (this.activeClass != val.device_id) {
        this.eventPageNum = 1;
        this.alarmFilterData = [];
      }
      this.activeClass = val.device_id;
      console.log("this.activeClass2", this.activeClass);
      this.selectItem = val;
      this.tipfun(val.status);
      // this.alarmFilterData = this.alarmData.filter(y => {
      //   return y.deviceId === val.device_id
      // })
      // .map(x =>{
      //   let date = new Date(x.reportTime)
      //   x.timeDate = Date.parse(date);
      //   return x
      // })
      // this.alarmFilterData.sort((a,b)=>{
      //   return b.reportTime - a.reportTime
      // });
      if (this.flvPlayer) this.flv_destroy();
      this.queryLiveing(); // 直播接口
      this.alarmAsset(); // 事件数据
    },
    // 滚动加载
    handleScroll() {
      if (this.temp) clearTimeout(this.temp);
      this.temp = setTimeout(() => {
        let scrollTop = document.getElementById("lineBox").scrollTop;
        let clientHeight = document.getElementById("lineBox").clientHeight;
        let scrollHeight = document.getElementById("lineBox").scrollHeight;
        if (scrollTop + clientHeight >= scrollHeight) {
          if (this.alarmData.length < 30) return;
          this.eventPageNum = this.eventPageNum + 1;
          this.alarmAsset(); // 事件数据
        }
      }, 600);
    },
    // 标签
    tipfun(status) {
      switch (status) {
        case 0:
          this.selectItem.typeCon = "待激活";
          this.selectItem.type = "";
          break;
        case 1:
          this.selectItem.typeCon = "在线";
          this.selectItem.type = "success";
          break;
        case 2:
          this.selectItem.typeCon = "离线";
          this.selectItem.type = "info";
          break;
        case 3:
          this.selectItem.typeCon = "禁用";
          this.selectItem.type = "danger";
          break;
      }
    },
    // 筛选数据
    screenData(value) {
      let eventName = "";
      for (let k in value) {
        if (k == this.customConfig.筛选对应key) {
          eventName = k;
          break;
        }
      }
      let message = [];
      console.log(value[eventName]);
      this.equipmentData.forEach((item, index) => {
        if (item[this.customConfig.筛选对应name].includes(value[eventName])) {
          message.push(item);
        }
      });
      console.log(message);
      this.equipmentfilterData = message;
    },
    // 初始化直播窗口
    initFlv() {
      if (flvjs.isSupported()) {
        this.videoEl = {};
        this.flvPlayer = null;
        // this.videoEl = this.$refs.videoEl;
        this.videoEl = document.getElementById("videoEl");
        flvjs.LoggingControl.forceGlobalTag = true;
        this.flvPlayer = flvjs.createPlayer(
          {
            type: "flv",
            isLive: true,
            url: this.videoItem.url,
          },
          {
            autoCleanupSourceBuffer: true, // 是否自动清理缓存
          }
        );

        // this.flvPlayer.on(flvjs.Events.METADATA_ARRIVED, (res) => {
        //   console.log('xxxxxxxxxxxxxxxxxx');
        //   console.log('视频加载完成')
        // })

        this.flvPlayer.attachMediaElement(this.videoEl);
        this.flvPlayer.load();
        this.flvPlayer.play();

        // if (this.videoEl.paused === true) {
        //   this.flvPlayer.unload()
        //   this.flvPlayer.detachMediaElement()
        // }

        // 监听错误事件
        this.flvPlayer.on(flvjs.Events.ERROR, (err, errdet) => {
          // 参数 err 是一级异常，errdet 是二级异常
          if (err == flvjs.ErrorTypes.MEDIA_ERROR) {
            console.log("媒体错误");
            if (this.flvPlayer) this.flv_destroy();
            if (errdet == flvjs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED) {
              console.log("媒体格式不支持");
              if (this.flvPlayer) this.flv_destroy();
            }
          }
          if (err == flvjs.ErrorTypes.NETWORK_ERROR) {
            console.log("网络错误");
            if (this.flvPlayer) this.flv_destroy();
            if (errdet == flvjs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
              console.log("http状态码异常");
              if (this.flvPlayer) this.flv_destroy();
            }
          }
          if (err == flvjs.ErrorTypes.OTHER_ERROR) {
            console.log("其他异常：", errdet);
            if (this.flvPlayer) this.flv_destroy();
          }
        });
      }
    },
    // 销毁flv
    flv_destroy() {
      this.flvPlayer.pause();
      this.flvPlayer.unload();
      this.flvPlayer.detachMediaElement();
      this.flvPlayer.destroy();
      this.flvPlayer = null;
    },
    // 弹窗关闭
    handleClose(done) {
      done();
    },
    // 弹窗显示
    dialogShow(it) {
      Object.keys(it).forEach((x) => {
        this.diaContent[x] = it[x];
      });
      console.log("this.diaContent", this.diaContent);
      this.queryimg();
    },
    videoClick() {
      // if (this.videoEl.paused === true) {
      //   console.log('this.videoEl',this.videoEl);
      //   // 已断流，重新拉流播放
      //   this.flvPlayer.attachMediaElement(this.videoEl)
      //   this.flvPlayer.load()
      //   this.flvPlayer.play()
      //   // this.videoEl.play();
      // }else {
      //   this.flvPlayer.unload()
      //   this.flvPlayer.detachMediaElement()
      // }
    },
    // 左侧设备列表数据
    async queryAsset() {
      // const deviceAsset = "29c571a9-e2f1-6c11-3d91-92568d982835";
      // let params = [];
      const { deviceAsset, productId } = this.customConfig || {};
      const params = [
        {
          column: "product_id",
          compareObj: productId,
          datatype: 0,
          type: 10,
        },
      ];
      const dataParams = {
        id: deviceAsset,
        pageSize: this.equipmentPageSize,
        pageNum: this.equipmentPageNum,
      };
      this.equipmentData = await queryAssetById(dataParams, params)
        .then((res) => {
          let key = res.data[0];
          let value = res.data[1];
          let data = value.map((val) => {
            let obj = {};
            key.forEach((k, index) => {
              obj[k.col_name] = val[index];
            });
            return obj;
          });
          return data;
        })
        .catch((err) => {
          // this.$message.error(err.status +` - `+ err.statusText)
        });
      console.log(this.sysVariables);
      if (this.sysVariables) {
        let message = [];
        let key = "";
        this.sysVariables.forEach((sysItem, sysIndex) => {
          if (sysItem.name == "current_office_id") {
            key = sysItem.default_value;
          }
        });
        this.equipmentData.forEach((item, index) => {
          if (item[this.customConfig.系统变量对应name].includes(key)) {
            message.push(item);
          }
        });
        this.equipmentData = message;
      }
      this.equipmentfilterData = this.equipmentData;
      this.selectOne(this.equipmentfilterData[0]);
      console.log("this.equipmentData", this.equipmentData);
    },
    // 直播请求
    async queryLiveing() {
      await queryLiveing(this.activeClass)
        .then((res) => {
          this.videoItem = res.data;
          this.initFlv();
        })
        .catch((err) => {
          this.videoItem = {
            deviceId: "",
            deviceName: "",
            expireTime: "",
            protocolCode: "",
            url: "",
          };
          this.videoEl = {};
          this.flvPlayer = null;
          // this.$message.error('直播接口：'+err.status +` - `+ err.statusText)
        });
    },
    // 右侧事件列表数据
    async alarmAsset() {
      // const eventAsset = "cebc0e313e29463da0361e8ab0c3f30f";
      let { eventAsset } = this.customConfig || {};
      const params = [
        {
          column: "deviceId",
          compareObj: this.activeClass,
          datatype: 0,
          type: 10,
        },
      ];
      const dataParams = {
        id: eventAsset,
        pageSize: this.eventPageSize,
        pageNum: this.eventPageNum,
      };
      this.alarmData = await queryAssetById(dataParams, params)
        .then((res) => {
          let key = res.data[0];
          let value = res.data[1];
          let data = value.map((val) => {
            let obj = {};
            key.forEach((k, index) => {
              obj[k.col_name] = val[index];
            });
            return obj;
          });
          return data;
        })
        .catch((err) => {
          // this.$message.error(err.status +` - `+ err.statusText)
        });
      this.alarmFilterData = this.alarmFilterData.concat(this.alarmData);
      console.log("this.alarmData", this.alarmData);
      console.log("this.alarmFilterData", this.alarmFilterData);
    },
    // 告警图片
    async queryimg() {
      let { pictureKey } = this.customConfig || {};
      let params = {
        devId: this.selectItem.device_id,
        eveId: this.diaContent[pictureKey]
        // eveId: this.diaContent.alarm_picture_info,
      };
      await queryWarnPicture(params)
        .then((res) => {
          this.diaContent.picUrl = res.data.picUrl;
          this.dialogVisible = true;
        })
        .catch((err) => {
          // this.$message.error(err.status +` - `+ err.statusText)
        });
    },
    triggerEvent() {
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEventNew({
          objectId: appId,
          componentId: componentId,
          type: "app",
          event: "screenData",
          payload: {
            value: "sasdasd",
          },
        });
    },
    do_EventCenter_screenData(value) {
      console.log(value);
      if (value.screen !== {}) {
        this.screenData(value.screen);
      }
    },
    Event_Center_getName() {
      return "安防子系统-AI告警-监控事件";
    },
  },
  destroyed() {
    this.flv_destroy();
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>

<style lang="less" scoped>
.monitoring_page {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;

  .left_box {
    padding-left: 10px;
    display: flex;
    flex: 1;
    height: 790px;
    flex-direction: column;
    .left_box_title {
      height: 50px;
      line-height: 50px;
      color: #7c7a86;
      font-weight: 600;
      font-size: 16;
    }
    .list-box {
      margin-top: 15px;
      padding-bottom: 30px;
      width: 280px;
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow-y: scroll;
      .list_title {
        height: 20px;
        min-height: 20px;
        line-height: 20px;
        margin-left: 15px;
        margin-bottom: 10px;
        font-size: 14px;
        color: #333;
        width: 260px;
        min-width: 260px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }
      .list-active {
        color: #409eff;
      }
      &::-webkit-scrollbar {
        width: 5px;
      }
      &::-webkit-scrollbar-track {
        background: rgb(179, 177, 177);
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb {
        background: rgb(136, 136, 136);
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: rgb(100, 100, 100);
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb:active {
        background: rgb(68, 68, 68);
        border-radius: 10px;
      }
    }
  }

  .center_box {
    margin: 0 10px 0 10px;
    padding: 0 10px 10px 10px;
    display: flex;
    flex-direction: column;
    flex: 4;
    box-shadow: 0 0 10px 5px #dad9dc;
    border-radius: 4px;

    .video_title {
      display: flex;
      align-items: center;
      width: 100%;
      height: 50px;
      .title {
        margin-right: 20px;
        color: #7c7a86;
        font-size: 16px;
        font-weight: 600;
      }
    }

    .centeredVideo {
      display: block;
      width: 100%;
      height: 100%;
      background: #333;
    }

    /* 所有控件 */
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

  .right_box {
    padding: 0 10px;
    display: flex;
    flex: 1;
    height: 790px;
    flex-direction: column;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 0 5px 2px #f0f0f2;
    .right_box_title {
      height: 50px;
      line-height: 50px;
      color: #7c7a86;
      font-weight: 600;
      font-size: 16;
    }
    .line_box {
      padding-bottom: 30px;
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow-y: scroll;
      .line_item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .left_con {
          display: flex;
          flex-direction: column;
          align-items: center;
          .pot {
            width: 8px;
            height: 8px;
            min-width: 8px;
            min-height: 8px;
            border-radius: 50%;
            background: #136eb7;
          }
          .pot_line {
            margin: 4px 0;
            width: 2px;
            height: 100%;
            background: #ece8e8;
          }
        }
        .center_con {
          display: flex;
          flex-direction: column;
          .center_title {
            font-size: 14px;
            color: #8e9097;
          }
          .center_text {
            margin: 10px 0;
            font-size: 14px;
            font-weight: 600;
            color: #333;
            width: 140px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
          }
        }
        .right_con {
          color: #136eb7;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
    .line_box::-webkit-scrollbar {
      display: none;
    }
  }
  .dia_content {
    display: flex;
    flex-direction: column;
    .event_img {
      width: 100%;
      height: 360px;
    }
    .event_con {
      min-height: 20px;
      line-height: 20px;
      margin-left: 20px;
      margin-top: 15px;
      font-size: 14px;
      color: #333;
      // width: 400px;
      // white-space: nowrap;
      // overflow: hidden;
      // text-overflow: ellipsis;
    }
  }
}
</style>
