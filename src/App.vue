<template>
  <div class="bigest">
    <div class="title">得民招聘网</div>
    <div class="big">
      <div class="left">
        <div class="ltop">
          <span @click="changeTab(index)" v-for="(item, index) in tab" :class="(index == count1 ? 'active' : '')">{{
              item
          }}</span>
        </div>
        <div class="lbottom">
          <div v-if="this.count1 == 0">
            <div v-for="item in this.contentData" class="content">
              <div class="content-left">
                <div class="ctitle">{{ item.title }}</div>
                <div class="ccontent">{{ item.content }}</div>
                <div class="cperson">联系人：{{ item.person }}</div>
              </div>
              <div class="row">
                <div class="red1">正在招</div>
                <div class="ccontent">江苏南京</div>
                <div>
                  <el-button type="primary">立即联系</el-button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="this.count1 == 1">
            <div v-for="item in this.userData" class="content1">
              <div>
                123
              </div>
              <div class="row1">
                <div>
                  <div class="ctitle">{{ item.name }}</div>
                  <div class="ccontent">{{ item.sex }}-{{ item.age }}岁-{{ item.nation }}族-工龄{{ item.seniority }}年</div>
                </div>
                <div class="cperson">{{ item.introduce }}</div>
              </div>
              <div class="row">
                <div style="font-size:16px;color:#7F7F7F">江苏南京</div>
                <el-button type="primary">立即联系</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mask">
        <div class="right">
          <div class="r-first">
            <div v-for="(item, index) in change" :key="index" :class="(index == count ? 'active' : '')"
              @click="changel(index)">
              {{ item }}
            </div>
          </div>
          <div class="rb" v-show="count == 0">
            <div>
              <el-input placeholder="请输入手机号" class="mobile" v-model="mobile" @input="mobileCheck">
              </el-input>
              <div v-show="!this.flag1" class="red">*请输入正确的手机号码</div>
            </div>
            <div class="yzcode">
              <div>
                <el-input placeholder="请输入图片验证码" class="mobile" v-model="yzm" @input="yzmCheck">
                  <template slot="append"><span class="imgyzm">123456</span></template>
                </el-input>
                <div v-show="!this.flag2" class="red">*验证码格式有误</div>
              </div>
            </div>
            <div class="yzcode">
              <div>
                <el-input placeholder="请输入验证码" class="mobile" v-model="sjyzm" @input="sjyzmCheck">
                  <template slot="append"><span class="getyzCode">获取验证码</span></template>
                </el-input>
                <div v-show="!this.flag3" class="red">*验证码格式有误</div>
              </div>
            </div>
            <div>
              <input type="checkbox" :checked="flag" @click="add">已阅读并同意<span class="getyzCode1">《隐私政策》《服务协议》</span>
              <el-button type="primary" class="login" @click="login" :disabled="!flag">登录</el-button>
            </div>
          </div>
          <div class="rb" v-show="count == 1">
            <div>
              <el-input placeholder="请输入手机号" class="mobile" v-model="mobile" @input="mobileCheck">
              </el-input>
              <div v-show="!this.flag1" class="red">*请输入正确的手机号码</div>
            </div>
            <div>
              <el-input placeholder="请输入姓名" class="mobile" v-model="name" @input="nameCheck">
              </el-input>
              <div v-show="!this.flag4" class="red">*请输入正确的姓名</div>
            </div>
            <div class="yzcode">
              <div>
                <el-input placeholder="请输入图片验证码" class="mobile" v-model="yzm" @input="yzmCheck">
                  <template slot="append"><span class="imgyzm">123456</span></template>
                </el-input>
              </div>
              <div v-show="!this.flag2" class="red">*验证码格式有误</div>
            </div>
            <div class="yzcode">
              <div>
                <el-input placeholder="请输入验证码" class="mobile" v-model="sjyzm" @input="sjyzmCheck">
                  <template slot="append"><span class="getyzCode">获取验证码</span></template>
                </el-input>
                <div v-show="!this.flag3" class="red">*验证码格式有误</div>
              </div>
            </div>
            <div>
              <input type="checkbox" :checked="flag" @click="add">已阅读并同意<span class="getyzCode1">《隐私政策》《服务协议》</span>
              <el-button type="primary" class="login" @click="register" :disabled="!flag">注册</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="skyblue">

    </div>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
import { queryAssetById } from "./api/asset"
export default {
  name: "App",
  props: {
    customConfig: Object,
    info: Object,
  },
  data() {
    return {
      mobile: '',
      yzm: '',
      sjyzm: '',
      name: '',
      contentData: [],
      userData: [],
      flag: false,
      flag1: true,
      flag2: true,
      flag3: true,
      flag4: true,
      change: ['登录', '注册'],
      tab: ['招工信息', '工人找活'],
      count: 0,
      count1: 0
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
    //请求数据图书馆的数据
    queryAssetById('29ba12cb-4b5f-4c0c-9564-4374fedba8cd').then(res => {
      this.contentData = this.translatePlatformDataToJsonArray(res).splice(0, 4)
    })
    queryAssetById('95667b34-c650-4046-8be4-f75973b27697').then(res => {
      this.userData = this.translatePlatformDataToJsonArray(res).splice(0, 3)
    })
  },
  methods: {
    //处理数据
    //  将平台返回数据转化为对象数组的形式 
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
      // console.log(tableData);
      return tableData;
    },
    //tab切换
    changeTab(i) {
      this.count1 = i
    },
    //登录
    login() {
      console.log('登录');
    },
    //注册
    register() {
      console.log('注册');
    },
    //手机号码验证
    mobileCheck() {
      let mobile1 = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
      this.flag1 = mobile1.test(this.mobile)
      //如果用户点击之后没有输入  不显示必填校验
      if (!this.mobile) {
        this.flag1 = true
      }
    },
    //图片验证码验证
    yzmCheck() {
      let yzm1 = /^[A-Za-z0-9]+$/
      this.flag2 = yzm1.test(this.yzm)
      //如果用户点击之后没有输入  不显示必填校验
      if (!this.yzm) {
        this.flag2 = true
      }
    },
    //短信验证码验证
    sjyzmCheck() {
      let sjyzm1 = /^\d+$/
      this.flag3 = sjyzm1.test(this.sjyzm)
      //如果用户点击之后没有输入  不显示必填校验
      if (!this.sjyzm) {
        this.flag3 = true
      }
    },
    //姓名验证
    nameCheck() {
      let name1 = /^(?:[\u4e00-\u9fa5·]{2,16})$/
      this.flag4 = name1.test(this.name)
      //如果用户点击之后没有输入  不显示必填校验
      if (!this.name) {
        this.flag4 = true
      }
    },
    add() {
      this.flag = !this.flag
    },
    changel(i) {
      this.count = i
      this.mobile = ''
      this.yzm = ''
      this.sjyzm = ''
      this.name = ''
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
    do_EventCenter_messageSuccess() {
      alert("动作执行成功！");
    },
    Event_Center_getName() {
      return "登录页面";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}

.r-first {
  width: 40%;
  height: 20px;
  display: flex;
  justify-content: space-around;
  font-size: 30px;
  color: #7F7F7F;
}

.r-first>div {
  cursor: pointer;
}

.red1 {
  color: red;
  font-size: 14px;
}

.cneter {
  display: flex;
  justify-content: space-between;
}

.skyblue {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  background-color: #4D9CFB;
  opacity: 0.9;
}

.imgyzm {
  cursor: pointer;
}

.big {
  width: 80%;
  position: relative;
  margin: 0 auto;
  height: 80%;
  margin-top: 80px;
  box-shadow: 10px 10px 10px 10px #f2f2f2;
  background-color: #fff;
}

.row {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.row1 {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.content-left {
  height: 50%;
  width: 70%;
  overflow: hidden;
  word-wrap: break-word;
  text-overflow: ellipsis;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.ctitle {
  font-weight: bolder;
  font-size: 16px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  margin-top: 15px;
  flex: 1;
}

.ccontent {
  font-size: 16px;
  color: #c2c2c3;
  margin: 10px 0;
}

.cperson {
  width: 70%;
  margin: 10px 0;
  font-size: 16px;
  color: #c2c2c3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
}

.content {
  height: 90%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f2f2f2;
}

.red {
  color: red;
  font-size: 14px;
}

.content1 {
  height: 200px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f2f2f2;
}

.lbottom {
  height: 93%;
  background-color: #fff;
  overflow: auto;

}

.lbottom>div {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid #ccc;
  font-size: 25px;
}

.ltop {
  width: 25%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.ltop>span {
  flex: 1;
  text-align: center;
  align-items: center;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  margin-right: 20px;
  font-size: 20px;
}


.bigest {
  width: 100%;
  height: 100%;
  position: relative;
  /* background-color: #ccc;
   */
  background-color: #fff;
  /* opacity: 0.8; */
  /* text-align: center; */
}

.mask {
  text-align: center;
  width: 30%;
  height: 70%;
  position: absolute;
  right: 3%;
  top: 5%;
  background-color: #fff;
  display: flex;
}

.mobile {
  width: 80%;
}

.left {
  width: 60%;
  height: 70%;
  /* border: 1px solid #fff; */
  /* border-radius: 10px; */
  position: absolute;
  top: 5%;
  left: 5%;
}

.right {
  width: 50%;
  height: 100%;
  flex: 1;
}

.rb {
  width: 100%;
  height: 80%;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.getyzCode,
.getyzCode1 {
  color: skyblue;
  cursor: pointer;
}

.getyzCode1 {
  font-weight: bolder;
}

.login {
  width: 80%;
  height: 60px;
  margin-top: 30px;
}

.title {
  padding-left: 240px;
  font-size: 30px;
  height: 80px;
  line-height: 80px;
  color: #4D9CFB;
  font-weight: bolder;
  border-bottom: 1px solid #ccc;
}

.active {
  color: #4D9CFB;
}
</style>
