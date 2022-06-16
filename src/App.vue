<template>
  <div class="bigest" ref="biggest">
    <div class="title">
      <div class="top">
        <div style="height:100%;width:60px">
          <img src="../output/images/1c4c7d184fa9d98a46fd36d187204c3.png" alt="" class="icon" />
        </div>
        <div>
          得民招聘网
        </div>
      </div>
    </div>
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
                <el-button type="primary">立即联系</el-button>
              </div>
            </div>
          </div>
          <div v-if="this.count1 == 1">
            <div v-for="item in this.userData" class="content1">
              <div class="userImg1">
                <img :src="item.imgUrl" alt="" class="userImg">
              </div>
              <div class="row1">
                <div>
                  <div class="ctitle">{{ item.name }}</div>
                  <div class="ccontent">{{ item.sex }} · {{ item.age }}岁 · {{ item.nation }}族 · 工龄{{ item.seniority }}年
                  </div>
                  <div class="lol">{{ item.skills }}</div>
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
                  <template slot="append"> <img :src="this.captchaUrl" class="img" @click="changePicyzm" /> </template>
                </el-input>
                <div v-show="!this.flag2" class="red">*验证码格式有误</div>
              </div>
            </div>
            <div class="yzcode">
              <div>
                <el-input placeholder="请输入验证码" class="mobile" v-model="sjyzm" @input="sjyzmCheck">
                  <template slot="append"><span class="getyzCode" @click="GetPhoneyzm">获取验证码</span></template>
                </el-input>
                <div v-show="!this.flag3" class="red">*验证码格式有误</div>
              </div>
            </div>
            <div>
              <input type="checkbox" :checked="flag" @click="add">已阅读并同意<span class="getyzCode1">《隐私政策》《服务协议》</span>
              <el-button type="primary" class="login" @click="login1" :disabled="!flag">登录</el-button>
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
                  <template slot="append"><img :src="this.captchaUrl" class="img" @click="changePicyzm" /></template>
                </el-input>
              </div>
              <div v-show="!this.flag2" class="red">*验证码格式有误</div>
            </div>
            <div class="yzcode">
              <div>
                <el-input placeholder="请输入验证码" class="mobile" v-model="sjyzm" @input="sjyzmCheck">
                  <template slot="append"><span class="getyzCode" @click="GetPhoneyzm">获取验证码</span></template>
                </el-input>
                <div v-show="!this.flag3" class="red">*验证码格式有误</div>
              </div>
            </div>
            <div>
              <input type="checkbox" :checked="flag" @click="add">已阅读并同意<span class="getyzCode1">《隐私政策》《服务协议》</span>
              <el-button type="primary" class="login" @click="register1" :disabled="!flag">注册</el-button>
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
import "element-ui/lib/theme-chalk/index.css"
import "./index.css";
import { queryAssetById, GetpicYzm, Phoneyzm, register, Login } from "./api/asset"
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
      count1: 0,
      count123: 0,
      captchaUrl: ''
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
    if(this.$refs.biggest.parentNode.parentNode){
      this.$refs.biggest.parentNode.parentNode.style.height='100%'
    }
    
    this.changePicyzm()
    // this.captchaUrl = 'http://10.15.111.11:18080/sdata/rest/system/authority/getAuthPic?module=123141241221'
    // GetpicYzm().then(() => {
    //   this.captchaUrl = 'http://10.15.111.11:18080/sdata/rest/system/authority/getAuthPic?module=123141241221'
    // })
    // this.getYanzhengImg()
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    let userConfig = JSON.parse(window.configuration.secondary_develop_login.current_value)
    // let userConfig = [
    //   //招工
    //   {
    //     asset_id: "8bf91192-0cc0-4be9-a5c3-535cea758ad5",
    //     title: "name1",
    //     content: "content1",
    //     person: "person1"
    //   },
    //   //找活
    //   {
    //     asset_id: "fe91018f-66b9-494f-9da7-3858443111f9",
    //     name: "title1",
    //     sex: "sex1",
    //     age: "age1",
    //     nation: "nation1",
    //     seniority: "seniority1",
    //     introduce: "introduce1",
    //     imgUrl: "imgUrl1",
    //     skills: "skills1"
    //   }
    // ]
    //userConfig.xxx  资产id  
    //请求数据图书馆的数据
    queryAssetById(userConfig[0].asset_id).then(res => {
      let contentData = this.translatePlatformDataToJsonArray(res)
      contentData.forEach((item, index) => {
        item.title = item[userConfig[0].title]
        item.content = item[userConfig[0].content]
        item.person = item[userConfig[0].person]
        this.contentData.push(item)
      })
      if (this.contentData.length > 10) {
        this.contentData = this.contentData.splice(0, 10)
      }
    })
    queryAssetById(userConfig[1].asset_id).then(res => {
      let userData = this.translatePlatformDataToJsonArray(res)
      userData.forEach((item, index) => {
        item.name = item[userConfig[1].name]
        item.sex = item[userConfig[1].sex]
        item.age = item[userConfig[1].age]
        item.nation = item[userConfig[1].nation]
        item.seniority = item[userConfig[1].seniority]
        item.introduce = item[userConfig[1].introduce]
        item.imgUrl = item[userConfig[1].imgUrl]
        item.skills = item[userConfig[1].skills]
        this.userData.push(item)
      })
      if (this.userData.length > 10) {
        this.userData = this.userData.splice(0, 10)
      }
    })
    // console.log(this.customConfig.data[0][0].title);
  },
  methods: {
    //获取图片验证码
    getYanzhengImg() {
      console.log(123);
      GetpicYzm().then(() => {
        this.captchaUrl = 'http://10.15.111.11:18080/sdata/rest/system/authority/getAuthPic?module=123141241221'
      })
    },
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
    //注册
    register1() {
      register(this.sjyzm, this.name, this.mobile).then(res => {
        // console.log(res);
        if (res.status == 500) {
          alert("该手机号已经注册")
        }
        if (res.status == 200) {
          alert("注册成功")
        }
      })
    },
    //登录
    login1() {
      Login(this.sjyzm, this.mobile).then(res => {
        // console.log(res);
        if (res.status == 200) {
          alert('登录成功')
        }
        if (res.status == 500) {
          alert('该手机号未注册')
        }
      })
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
    //更改图片验证码
    changePicyzm() {
      GetpicYzm().then(response => {
        const url =
          'data:image/png;base64,' +
          btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );

        this.captchaUrl = url
      })
        .catch(error => {
          // debugger
          console.log(error);
          const url =
            'data:image/png;base64,' +
            btoa(
              new Uint8Array(error.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );

          this.captchaUrl = url
        });
      // GetpicYzm().then(() => {
      //   this.captchaUrl = 'http://10.15.111.11:18080/sdata/rest/system/authority/getAuthPic?module=123141241221'
      // })
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
    //获取短信验证码
    GetPhoneyzm() {
      Phoneyzm(this.yzm, String(this.mobile)).then(res => {
        // console.log(res);
        if (res.status == 500) {
          alert('短信发送间隔必须大于一分钟')
        }
      })
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
  margin: 0;
  padding: 0;
}

/* .el-button{
  width: 100%;
  height: 20%;
} */
button {
  appearance: auto;
  writing-mode: horizontal-tb !important;
  text-rendering: auto;
  color: -internal-light-dark(black, white);
  letter-spacing: normal;
  word-spacing: normal;
  line-height: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: center;
  align-items: flex-start;
  cursor: default;
  box-sizing: border-box;
  background-color: -internal-light-dark(rgb(239, 239, 239), rgb(59, 59, 59));
  margin: 0em;
  padding: 1px 6px;
  cursor: pointer;
  height: 26px;
}

.top {
  display: flex;
  justify-content: space-around;
  width: 25%;
  padding-left: 200px;
  height: 100px;
  /* line-height: 100px; */
  color: #4D9CFB;
  font-weight: bolder;
  /* vertical-align: text-bottom; */
}

.icon {
  width: 60px;
  height: 60px;
  line-height: 100px;
  /* margin-top: 20px; */
  margin-right: 20px;
}

.lol {
  width: 30%;
  font-size: 14px;
  background-color: rgba(245, 246, 250);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: #7F7F7F;
  text-align: center;
}

.userImg {
  width: 60px;
  height: 60px;
  margin: 0 auto;
}

.userImg1 {
  height: 100%;
  line-height: 200px;
}

html,
body {
  width: 100%;
  height: 100%;
}

.img {
  width: 100px;
  height: 30px;
  cursor: pointer;
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

.lefttop {
  width: 40%;
}

.skyblue {
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
  height: calc(100% - 100px - 28%);
  margin-top: 80px;
  box-shadow: 10px 10px 10px 10px #f2f2f2;
  background-color: #fff;
}

.row {
  /* height: 100%; */
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
  justify-content: space-around;
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
  justify-content: space-around;
  border-top: 1px solid #f2f2f2;
}

.lbottom {
  height: 93%;
  background-color: #fff;
  overflow: auto;

}

.lbottom::-webkit-scrollbar {
  width: 0;
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
  height: 1007px;
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
  width: 100%;
  /* padding-left: 240px; */
  font-size: 30px;
  height: 100px;
  line-height: 100px;
  color: #4D9CFB;
  font-weight: bolder;
  border-bottom: 1px solid #ccc;
  /* display: flex;
  justify-content: space-around; */
}

.active {
  color: #4D9CFB;
}
</style>
