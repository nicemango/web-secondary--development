<template>
  <div class="main">
    <span class="addressSpan"
      >位置：一号会议厅 <span class="videoGreen" v-show="videoStatus"> (录播中)</span><span class="videoRed" v-show="!videoStatus"> (未录播)</span
      ><el-switch v-model="videoStatus" @change="videoChange" active-color="#13ce66" inactive-color="#ff4949"> </el-switch
    ></span>
    <div class="mainTop">
      <div class="topLeft">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="终端" name="zhongduan" class="tabLable">
            <el-checkbox-group v-model="terminalCheckList">
              <el-checkbox v-for="(item, index) in terminalList" :key="index" :disabled="item.status == '紧急'" :label="item.device_name"></el-checkbox>
            </el-checkbox-group>
            <ul>
              <li v-for="(item, index) in terminalList" :key="index">
                <span v-show="item.status !== '紧急' && !item.zhuxi" @click="zhuxichange(item, index)">主席</span>
                <span v-show="item.status !== '紧急' && item.zhuxi" style="color: red">主席</span>
                <span v-if="item.status !== '紧急'" @click="call">呼叫</span>
                <span v-if="item.status == '紧急'" style="color: red" @click="recall">重拨</span>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="本地" name="bendi" class="tabLable">
            <el-checkbox-group v-model="localCheckList">
              <el-checkbox v-for="(item, index) in localList" :key="index" :label="item.device_name"> </el-checkbox>
            </el-checkbox-group>
            <ul>
              <li v-for="(item, index) in localList" :key="index">
                <span v-if="item.status !== '紧急'">呼叫</span>
              </li>
            </ul></el-tab-pane
          >
          <el-tab-pane label="融合" name="ronghe" class="tabLable">
            <el-checkbox-group v-model="fuseCheckList">
              <el-checkbox v-for="(item, index) in fuseList" :key="index" :label="item.device_name"></el-checkbox>
            </el-checkbox-group>
            <ul>
              <li v-for="(item, index) in fuseList" :key="index">
                <span v-if="item.status !== '紧急'">呼叫</span>
              </li>
            </ul></el-tab-pane
          >
          <el-tab-pane label="监控" name="jiankong" class="tabLable">
            <el-checkbox-group v-model="monitorCheckList">
              <el-checkbox v-for="(item, index) in monitorList" :key="index" :label="item.device_name"></el-checkbox>
            </el-checkbox-group>
            <ul>
              <li v-for="(item, index) in monitorList" :key="index">
                <span v-if="item.status !== '紧急'">呼叫</span>
              </li>
            </ul></el-tab-pane
          >
        </el-tabs>
        <div class="advance">
          <el-button @click="advance">预监</el-button>
        </div>
      </div>
      <div class="topCenter">
        <div class="monitorTop">
          <div class="monitorTopLeft">
            <el-select class="agreement" v-model="videoSouce" placeholder="IPV4">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <img class="mainImg" src="../pluginTemp/images/demoimg.png" alt="" />
            <!-- <videoPlayer class="vjs-custom-skin videoPlayer" :options="playerOptions" ref="videoPlayer" :playsinline="true"></videoPlayer> -->
            <img class="micIcon" style="right: 2.8px" @click="imgShowChange" v-show="imgshow" src="../pluginTemp/images/openMIC.png" alt="" />
            <img class="micIcon" @click="imgShowChange" v-show="!imgshow" src="../pluginTemp/images/offMIC.png" alt="" />
          </div>
          <div class="monitorTopRight" @dragenter="(e) => e.preventDefault()" @dragover="(e) => e.preventDefault()" @dragleave="dragleave" @drop.stop="drop">
            <img class="mainImg" src="../pluginTemp/images/demoimg.png" alt="" />
          </div>
        </div>
        <div class="monitorbBottom">
          <div class="monitorBottom1">
            <img class="mainImg" src="../pluginTemp/images/demoimg2.png" alt="" />
          </div>
          <div class="monitorBottom2">
            <img class="mainImg" src="../pluginTemp/images/demoimg3.png" alt="" />
          </div>
          <div class="monitorBottom3">
            <img class="mainImg" src="../pluginTemp/images/demoimg2.png" alt="" />
          </div>
          <div class="monitorBottom4">
            <img class="mainImg" src="../pluginTemp/images/demoimg3.png" alt="" />
          </div>
        </div>
      </div>
      <div class="topRight">
        <div>
          <img @click="openLogout" src="../pluginTemp/images/logout.png" alt="" />
        </div>
        <div>
          <img @click="openStatus" src="../pluginTemp/images/setting.png" alt="" />
        </div>
        <div>
          <img @click="lineStatus" src="../pluginTemp/images/line.png" alt="" />
        </div>
        <div>
          <img @click="addStatus" src="../pluginTemp/images/add.png" alt="" />
        </div>
      </div>
    </div>
    <div class="mainBottom">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="终端资源" name="zhongduan" class="tabPane">
          <div class="arrowBox" @click="arrowClick('left')">
            <img src="../pluginTemp/images/leftArrow.png" alt="" />
          </div>
          <el-carousel ref="cardShow" :autoplay="false" interval="0" indicator-position="none" :loop="false" arrow="never">
            <el-carousel-item>
              <div draggable="true" @dragstart="dragstart($event)" v-for="(item, index) in buttomTabList" :key="index" class="carouselItem">
                <div class="closeBox" v-show="item.url" @click="closeButtom(item, index)">x</div>
                <img :src="item.url" alt="" />
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg2.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg3.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg2.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg2.png" alt="" />
              </div>
            </el-carousel-item>
          </el-carousel>
          <div class="arrowBoxRight" @click="arrowClick('right')">
            <img src="../pluginTemp/images/leftArrow.png" alt="" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="融合通讯" name="ronghe" class="tabPane">
          <div class="arrowBox" @click="arrowClick('left')">
            <img src="../pluginTemp/images/leftArrow.png" alt="" />
          </div>
          <el-carousel ref="cardShow1" :autoplay="false" interval="0" indicator-position="none" :loop="false" arrow="never">
            <el-carousel-item>
              <div draggable="true" @dragstart.native="dragstart($event)" v-for="(item, index) in buttomTabList" :key="index" class="carouselItem">
                <div class="closeBox" v-show="item.url" @click="closeButtom(item, index)">x</div>
                <img :src="item.url" alt="" />
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg2.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg2.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg2.png" alt="" />
              </div>
            </el-carousel-item>
          </el-carousel>
          <div class="arrowBoxRight" @click="arrowClick('right')">
            <img src="../pluginTemp/images/leftArrow.png" alt="" /></div
        ></el-tab-pane>
        <el-tab-pane label="监控资源" name="jiankong" class="tabPane">
          <div class="arrowBox" @click="arrowClick('left')">
            <img src="../pluginTemp/images/leftArrow.png" alt="" />
          </div>
          <el-carousel ref="cardShow2" :autoplay="false" interval="0" indicator-position="none" :loop="false" arrow="never">
            <el-carousel-item>
              <div draggable="true" @dragstart="dragstart($event)" v-for="(item, index) in buttomTabList" :key="index" class="carouselItem">
                <div class="closeBox" v-show="item.url" @click="closeButtom(item, index)">x</div>
                <img :src="item.url" alt="" />
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg2.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg2.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg2.png" alt="" />
              </div>
            </el-carousel-item>
          </el-carousel>
          <div class="arrowBoxRight" @click="arrowClick('right')">
            <img src="../pluginTemp/images/leftArrow.png" alt="" /></div
        ></el-tab-pane>
        <el-tab-pane label="本地设备" name="bendi" class="tabPane">
          <div class="arrowBox" @click="arrowClick('left')">
            <img src="../pluginTemp/images/leftArrow.png" alt="" />
          </div>
          <el-carousel ref="cardShow3" :autoplay="false" interval="0" indicator-position="none" :loop="false" arrow="never">
            <el-carousel-item>
              <div draggable="true" @dragstart="dragstart($event)" v-for="(item, index) in buttomTabList" :key="index" class="carouselItem">
                <div class="closeBox" v-show="item.url" @click="closeButtom(item, index)">x</div>
                <img :src="item.url" alt="" />
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg2.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg2.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg.png" alt="" />
              </div>
              <div class="carouselItem">
                <div class="closeBox">x</div>
                <img src="../pluginTemp/images/demoimg2.png" alt="" />
              </div>
            </el-carousel-item>
          </el-carousel>
          <div class="arrowBoxRight" @click="arrowClick('right')">
            <img src="../pluginTemp/images/leftArrow.png" alt="" /></div
        ></el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="关闭提示" :visible.sync="offDialogVisible" width="25%" :before-close="handleClose">
      <span>确认结束会议？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="offDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="offDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="会场状态" :visible.sync="statusDialogVisible" width="50%" :before-close="handleStatusClose">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column align="center" prop="name" label="会场名称">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '在线'">{{ scope.row.name }}</span>
            <span v-else style="color: red">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="flag" label="连接标识">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '在线'">{{ scope.row.flag }}</span>
            <span v-else style="color: red">{{ scope.row.flag }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '在线'">{{ scope.row.status }}</span>
            <span v-else style="color: red">{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="recall" label="重呼">
          <template slot-scope="scope">
            <i class="el-icon-phone" v-if="scope.row.recall == '在线'" style="font-size: 30px"></i>
            <i class="el-icon-phone" v-else style="font-size: 30px; color: red"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="mic" label="麦克风">
          <template slot-scope="scope">
            <i class="el-icon-turn-off-microphone" v-if="scope.row.mic == '在线'" style="font-size: 30px"></i>
            <i class="el-icon-microphone" v-else style="font-size: 30px"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="speaker" label="扬声器">
          <template slot-scope="scope">
            <i class="iconfont" v-if="scope.row.recall == '在线'">&#xe810;</i>
            <i class="iconfont" v-else>&#xe811;</i>
          </template>
        </el-table-column>
        <el-table-column align="center" label="离会">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="leaveMeeting(scope.row)">离会</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="线路切换" :visible.sync="lineDialogVisible" width="25%" :before-close="handleLineClose">
      <el-radio-group v-model="lineData">
        <el-radio label="IPV4">全部切换IPV4</el-radio>
        <br />
        <el-radio label="IPV6">全部切换IPV6</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lineDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="lineDialogChange">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="addDialogVisible" width="50%" :show-close="false">
      <el-table :data="addtableData" border style="width: 100%">
        <el-table-column align="center" prop="name" label="名称">
          <el-input></el-input>
        </el-table-column>
        <el-table-column align="center" prop="model" label="型号">
          <el-select class="agreement" v-model="modelOptionsModel" placeholder="">
            <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-table-column>
        <el-table-column align="center" prop="type" label="类型">
          <el-select class="agreement" v-model="typeOptionsModel" placeholder="">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-table-column>
        <el-table-column align="center" prop="flag" label="连接标识"> <el-input></el-input> </el-table-column>
        <el-table-column align="center" prop="username" label="用户名"> <el-input></el-input></el-table-column>
        <el-table-column align="center" prop="password" label="密码"> <el-input></el-input></el-table-column>
        <el-table-column align="center" prop="recall" width="180" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary">其他参数</el-button>
            <el-button size="mini" type="primary" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="addRow" @click="addRow">➕新增</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import { videoPlayer } from "vue-video-player";
import video1 from "../../应用二开.mp4";
import eventActionDefine from "./components/msgCompConfig";
import { queryAssetById } from "./api/asset";
import "./index.css";
export default {
  name: "App",
  props: {
    customConfig: Object,
    info: Object,
  },
  components: {
    videoPlayer,
  },
  data() {
    return {
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.1], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "rtmp/mp4", // 类型
            src: "rtmp://live.hkstv.hk.lxdns.com/live/hks1", // url地址
          },
        ],
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
      activeName: "zhongduan",
      offDialogVisible: false,
      statusDialogVisible: false,
      lineDialogVisible: false,
      addDialogVisible: false,
      imgshow: true,
      lineData: "IPV4",
      videoStatus: true,
      addtableData: [],
      videoSouce: "",
      terminalList: [],
      localList: [],
      fuseList: [],
      monitorList: [],
      tableData: [
        {
          flag: "10.10.11.12",
          name: "上海会场",
          status: "在线",
          recall: "在线",
          mic: "在线",
          speaker: "在线",
        },
        {
          flag: "10.10.11.12",
          name: "上海会场",
          status: "离线",
          recall: "离线",
          mic: "离线",
          speaker: "离线",
        },
        {
          flag: "10.10.11.12",
          name: "上海会场",
          status: "在线",
          recall: "在线",
          mic: "在线",
          speaker: "在线",
        },
      ],
      options: [
        {
          value: "IPV4",
          label: "IPV4",
        },
        {
          value: "IPV6",
          label: "IPV6",
        },
      ],
      modelOptions: [
        {
          value: "华为",
          label: "华为",
        },
        {
          value: "中兴",
          label: "中兴",
        },
      ],
      typeOptions: [
        {
          value: "H.323",
          label: "H.323",
        },
      ],
      modelOptionsModel: "",
      typeOptionsModel: "",
      terminalCheckList: ["511会议厅", "东城应急终端zz"],
      buttomTabList: [
        {
          url: require("../pluginTemp/images/demoimg.png"),
        },
        {
          url: require("../pluginTemp/images/demoimg2.png"),
        },
        {
          url: require("../pluginTemp/images/demoimg3.png"),
        },
        {
          url: require("../pluginTemp/images/demoimg2.png"),
        },
        {
          url: require("../pluginTemp/images/demoimg3.png"),
        },
      ],
      localCheckList: [],
      fuseCheckList: [],
      monitorCheckList: [],
      listId: 0,
    };
  },
  computed: {},
  mounted() {
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    let message = "d731f7fc-fbed-4fb7-b137-9d59936469bd";
    queryAssetById(this.customConfig.终端资产ID ? this.customConfig.终端资产ID : message).then((res) => {
      let info = [];
      info = this.translatePlatformDataToJsonArray(res);
      info.forEach((item, index) => {
        if (index == 0) {
          item.zhuxi = true;
        } else {
          item.zhuxi = false;
        }
      });
      this.terminalList = info;
    });
    message = "8ff57245-f451-4871-95b8-3ad73adc5b1f";
    queryAssetById(this.customConfig.本地资产ID ? this.customConfig.本地资产ID : message).then((res) => {
      this.localList = this.translatePlatformDataToJsonArray(res);
    });
    message = "0ec7d814-da23-40dd-b5c1-e89e7f6cbc6f";
    queryAssetById(this.customConfig.融合资产ID ? this.customConfig.融合资产ID : message).then((res) => {
      this.fuseList = this.translatePlatformDataToJsonArray(res);
    });
    message = "6784a243-b594-493f-b8d4-faf426567ebe";
    queryAssetById(this.customConfig.监控资产ID ? this.customConfig.监控资产ID : message).then((res) => {
      this.monitorList = this.translatePlatformDataToJsonArray(res);
    });
  },
  methods: {
    // 处理资产数据
    translatePlatformDataToJsonArray(originTableData) {
      let originTableHeader = originTableData.data[0];
      let tableHeader = [];
      originTableHeader.forEach((item) => {
        tableHeader.push(item.col_name);
      });
      let tableBody = originTableData.data[1];
      let tableData = [];
      tableBody.forEach((tableItem) => {
        let temp = {};
        tableItem.forEach((item, index) => {
          temp[tableHeader[index]] = item;
        });
        tableData.push(temp);
      });
      return tableData;
    },
    // 点击主席
    zhuxichange(item, index) {
      this.terminalList.forEach((item, itemIndex) => {
        item.zhuxi = false;
      });
      this.terminalList[index].zhuxi = true;
      this.$message({
        message: "主席已变更",
        type: "success",
      });
    },
    // 重拨
    recall() {
      this.$message({
        message: "已重拨 等待中",
        type: "success",
      });
    },
    // 呼叫
    call() {
      this.$message({
        message: "已呼叫 等待中",
        type: "success",
      });
    },
    // 预监
    advance() {
      this.$message({
        message: "预监资源已更新",
        type: "success",
      });
    },
    // 底部删除
    closeButtom(item, index) {
      this.buttomTabList[index].url = "";
      this.$message({
        message: "删除成功",
        type: "success",
      });
    },
    // 拖动拖动源
    dragstart(event) {
      // this.$message({
      //   message: "已成功获取拖动源信息",
      //   type: "success",
      // });
      console.log(event, "拖动源信息");
    },
    // 拖动接收源
    drop(event) {
      console.log(9999);
      event.preventDefault();
      // this.$message({
      //   message: "已成功获取接收源信息",
      //   type: "success",
      // });
      console.log(event, "接收源信息");
    },
    dragleave(event) {
      event.preventDefault();
      console.log("dragleave",event);
    },
    // 线路弹窗事件
    lineDialogChange() {
      this.lineDialogVisible = false;
      this.$message({
        message: "保存成功",
        type: "success",
      });
    },
    // 退出弹窗
    handleClose() {
      this.offDialogVisible = false;
    },
    // 会场状态弹窗
    handleStatusClose() {
      this.statusDialogVisible = false;
    },
    // 线路切换弹窗
    handleLineClose() {
      this.lineDialogVisible = false;
    },
    // 新增设备弹窗
    handleAddClose() {
      this.addDialogVisible = false;
    },
    // 退出弹窗
    openLogout() {
      this.offDialogVisible = true;
    },
    // 会场状态弹窗
    openStatus() {
      this.statusDialogVisible = true;
    },
    // 线路切换弹窗
    lineStatus() {
      this.lineDialogVisible = true;
    },
    // 新增设备弹窗
    addStatus() {
      this.addDialogVisible = true;
    },
    // 录播
    videoChange() {
      this.videoStatus = this.videoStatus;
      if (this.videoStatus == true) {
        this.$message({
          message: "正在录播中",
          type: "success",
        });
      } else {
        this.$message({
          message: "录制已关闭",
          type: "warning",
        });
      }
    },
    // 麦克风
    imgShowChange() {
      this.imgshow = !this.imgshow;
      this.$message({
        message: "麦克风状态已切换",
        type: "success",
      });
    },
    // tab改变
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 箭头点击
    arrowClick(val) {
      if (val === "right") {
        this.$refs.cardShow.next();
      } else {
        this.$refs.cardShow.prev();
      }
    },
    // 离会按钮
    leaveMeeting(row) {
      this.$message({
        message: "已离会",
        type: "warning",
      });
    },
    // 弹窗新增行
    addRow() {
      let message = {
        name: "",
        model: "",
        type: "",
        flag: "",
        username: "",
        password: "",
        listId: this.listId++,
      };
      this.addtableData.push(message);
      this.$message({
        message: "新增成功",
        type: "success",
      });
    },
    // 弹窗删除行
    deleteRow(row) {
      console.log(row);
      this.addtableData.forEach((item, index) => {
        if (item.listId == row.listId) {
          this.addtableData.splice(index, 1);
          this.$message({
            message: "删除成功",
            type: "success",
          });
        }
      });
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
<style lang="less" scoped>
.main {
  height: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  background-color: rgba(0, 21, 41, 1);
}
.videoGreen {
  color: #13ce66 !important;
}
.videoRed {
  color: #ff4949 !important;
}
.addressSpan {
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
  margin-left: 0.5%;
}
.mainTop {
  height: 67%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  .topLeft {
    border: 3.5px solid #2062a0;
    height: 100%;
    width: 18.5%;
    background-color: #113164;
    /deep/.el-tabs__content,
    .el-tabs {
      height: 90%;
    }
    .tabLable {
      display: flex;
      justify-content: space-between;
      overflow: scroll;
      height: 100%;
      overflow-x: hidden;
      /*滚动条样式*/
      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(250, 250, 250, 1);
        background: rgba(0, 0, 0, 0.2);
      }
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
      }
      ul {
        width: 45%;
        list-style: none;
        margin: 0px;
        padding-top: 5px;
        li {
          color: #ffffff;
          display: flex;
          justify-content: end;
          height: 19px;
          margin-bottom: 30px;
          // margin-top: 5px;
          span {
            cursor: pointer;
            margin-left: 5px;
            margin-right: 5px;
            white-space: nowrap; /*强制span不换行*/
            display: inline-block; /*将span当做块级元素对待*/
            width: 32px; /*限制宽度*/
            overflow: hidden; /*超出宽度部分隐藏*/
            text-overflow: ellipsis; /*超出部分以点号代替*/
            line-height: 0.9; /*数字与之前的文字对齐*/
          }
        }
      }
    }
    .advance {
      height: 10%;
      width: 100%;
      display: flex;
      justify-content: center;
      /deep/.el-button {
        width: 160px;
        height: 40px;
        color: #ffffff;
        border: 0px rgba(80, 115, 237, 0.580392156862745);
        background-color: rgba(80, 115, 237, 0.580392156862745);
        &:hover {
          border-color: rgba(59, 96, 229, 1);
          background-color: rgba(59, 96, 229, 1);
        }
      }
    }
    /deep/ .el-tabs__header {
      border: 0px;
    }
    /deep/.el-tabs__item {
      border-color: #2062a0;
      border-bottom-width: 0px;
      color: #ffffff;
      height: 30px;
      padding: 0 10px;
    }
    /deep/ .el-tabs__nav {
      border-radius: 0px;
      border-color: #2062a0;
      border-top: 0px;
      border-right-color: #2062a0;
      border-left: 0;
      border-bottom: 1px solid #2062a0;
    }
    /deep/.el-checkbox-group {
      display: flex;
      flex-direction: column;
    }
    /deep/.el-checkbox {
      margin-left: 10px;
      margin-bottom: 27px;
      // margin-top: 5px;
      line-height: 22px;
      width: 60%;
      span {
        margin-right: 5px;
        margin-top: -2px;
      }
    }
    /deep/.is-active {
      background-color: #5073ed;
    }
    /deep/.el-checkbox__label {
      color: #ffffff;
    }
    /deep/.is-checked span {
      color: red;
    }
  }
  .topCenter {
    border: 3.5px solid #2062a0;
    height: 100%;
    width: 73.5%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .monitorTop {
      height: 63%;
      display: flex;
      justify-content: space-between;
      .monitorTopLeft,
      .monitorTopRight {
        width: 49.9%;
        height: 100%;
        position: relative;
        background: #7d7d7d;
        .mainImg {
          width: 100%;
          height: 100%;
        }
        .micIcon {
          position: absolute;
          right: 0;
          bottom: 0;
          cursor: pointer;
        }
        .agreement {
          position: absolute;
          left: 0;
          bottom: 0;
          color: #ffffff;
          font-size: 22px;
          font-weight: 700;
        }
        /deep/.el-input__inner {
          border: 0px;
          width: 100px;
          line-height: 22px;
          font-size: 20px;
          padding: 0;
          color: #ffffff !important;
          background: transparent;
          &::placeholder {
            color: #ffffff !important;
          }
        }

        /deep/.el-input__suffix {
          display: none;
        }
      }
    }
    .monitorbBottom {
      height: 36.6%;
      display: flex;
      justify-content: space-between;
      div {
        width: 24.8%;
        height: 100%;
        background: #7d7d7d;
        .mainImg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .topRight {
    border: 3.5px solid #2062a0;
    height: 100%;
    width: 6.5%;

    div {
      display: flex;
      height: 60px;
      justify-content: center;
      margin-top: 15px;
      &:first-child {
        border-bottom: 1px solid #ffffff;
      }
    }

    img {
      width: 45px;
      height: 45px;
      cursor: pointer;
    }
  }
}
.mainBottom {
  margin-top: 0.5%;
  height: 28%;
  box-sizing: border-box;
  width: 99%;
  margin-left: 0.5%;
  border: 3.5px solid #2062a0;
  /deep/ .el-tabs__header {
    border: 0px;
    margin: 0px;
  }
  /deep/ .el-tabs__nav {
    border: 0px;
    padding-left: 100px;
  }
  /deep/ .el-tab-pane,
  .el-tabs {
    height: 100%;
  }
  /deep/ .el-tabs__content {
    height: calc(100% - 40px);
  }
  /deep/.el-tabs__item {
    border-color: #2062a0;
    border-bottom-width: 0px;
    color: #ffffff;
    border: 0px;
  }
  /deep/.is-active {
    background-color: #5073ed;
  }
  /deep/.el-carousel--horizontal {
    height: 100%;
    width: 100%;
  }
  /deep/.el-carousel__container {
    height: 100%;
    width: 92%;
    overflow: hidden;
    margin-left: 3.3%;
  }
  .arrowBox,
  .arrowBoxRight {
    height: 60%;
    width: 40px;
    margin-top: 30px;
    background: #0f264d;
    cursor: pointer;

    img {
      margin-top: 40%;
      margin-left: 20%;
      height: 70%;
      width: 20px;
      cursor: pointer;
    }
  }
  .arrowBoxRight {
    transform: rotateY(180deg);
  }
  /deep/.el-carousel__item {
    width: 100%;
    background-color: #7d7d7d !important;
    display: flex;
    justify-content: space-around;
  }
  .carouselItem {
    height: 100%;
    width: 19.9%;
    position: relative;
    img {
      height: 100%;
      width: 100%;
    }
    .closeBox {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      width: 20px;
      height: 20px;
      background: #ffffff;
      border-radius: 4px;
      line-height: 17px;
      font-size: 20px;
      text-align: center;
      font-weight: 700;
    }
  }
  .tabPane {
    display: flex;
  }
}
/deep/.el-radio {
  margin-bottom: 20px;
}
.addRow {
  width: 100% !important;
  border-top: 0px !important;
  border-radius: 0px !important;
}
@font-face {
  font-family: "iconfont";
  src: url("iconfont.woff2?t=1659519918538") format("woff2"), url("iconfont.woff?t=1659519918538") format("woff"), url("iconfont.ttf?t=1659519918538") format("truetype");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 30px;
  font-weight: 700;
  font-style: normal;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
