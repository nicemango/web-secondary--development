import React, { Component, useState } from "react";
import { Button, Tabs, Form, Input, Select, DatePicker, message, Empty, ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import moment from "moment";
import "./app.less";
import { RightCircleOutlined } from "@ant-design/icons";
import { datasOne, datasTwo, datasThree } from "./requestDate";
import { formSubmit, signUpSearch, getFirtsListOne, getFirtsListTwo, getTwoList, getThreeList, getDocInfo, getFourList, browseUp } from "./api/asset";
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeName: "first", //tab标签识别
      goFirstInfoShow: 0, //首页三个页面的显示
      firstListOne: [], //首页第一个列表的上模块
      firstListTwo: [], //首页第一个列表的中间模块
      firstListThree: [], //首页第一个列表的下面模块
      firstSecondList: [], //首页第二个列表
      firstInfoDateTop: {}, //首页上面模块详情数据
      firstInfoDateCenter: {}, //首页中间模块详情数据
      firstInfoDateBottom: {}, //首页底部模块详情数据
      docLinkDate: [], //文章详情底部链接数据
      twoList: [], //政策法规列表数据
      twoInfoDate: [], //政策法规详情
      twoInfoShow: true, //政策法规列表，详情显示隐藏
      threeInfoShow: true, //工作动态列表，详情显示隐藏
      threeList: [], //工作动态列表数据
      threeInfoDate: [], //工作动态详情数据
      fourInfoShow: true, //公告通知列表，详情显示隐藏
      fourList: [], //公告通知列表数据
      fourInfoDate: {}, //公告通知详情数据
      topCenterBottom: 0, //首页三个模块对应的详情Dom
      signUpForm: {
        organizationName: null,
        contacts: null,
        contactsPhone: null,
        address: null,
        joinTime: null,
        operationMessage: null,
      },
    };
  }

  // tab事件
  callback = (key) => {
    console.log(key);
    switch (key) {
      case "1":
        this.setState({
          goFirstInfoShow: 0,
        });
        this.getFirstListOne();
        break;
      case "2":
        this.setState({
          twoInfoShow: true,
        });
        this.getTwoList();
        break;
      case "3":
        this.setState({
          threeInfoShow: true,
        });
        this.getThreeList();
        break;
      case "4":
        this.setState({
          fourInfoShow: true,
        });
        this.getFourList();
        break;
      default:
        break;
    }
  };
  componentDidMount() {
    this.getFirstListOne();
    this.getTwoList();
    this.getThreeList();
    this.getFourList();
  }
  submitFinish = () => {
    const asset_id = "53ac47fb-ff00-55ae-3a1a-13724bacd841";
    let submitInfo = {
      columnNames: ["data_id"],
      filters: [
        {
          column: "parent_id",
          compareObj: this.state.firstInfoDateCenter.data_id,
          datatype: 0,
          satisfy_type: 0,
          type: 4,
          varibleType: "components",
        },
        {
          column: "organization_name",
          compareObj: this.state.signUpForm.organizationName,
          datatype: 0,
          satisfy_type: 0,
          type: 4,
          varibleType: "components",
        },
      ],
    };
    const form_id = "bf0721adbcdd4737bc9d92bd1ebaa0fb";
    const messageInfo = {
      childTableDataForm: [],
      childrenColumnList: [],
      formDataAttrList: [],
      masterColumnList: [
        {
          asset_id: "53ac47fb-ff00-55ae-3a1a-13724bacd841",
          col_datatype: 0,
          col_name: "35d7c55dce7422820686ffed0d9ceeec",
          col_value: this.state.signUpForm.organizationName,
        },
        {
          asset_id: "53ac47fb-ff00-55ae-3a1a-13724bacd841",
          col_datatype: 0,
          col_name: "963ec522-9b23-4ca6-8af7-7fa4be69385d",
          col_value: this.state.firstInfoDateCenter.data_id,
        },
        {
          asset_id: "53ac47fb-ff00-55ae-3a1a-13724bacd841",
          col_datatype: 0,
          col_name: "2202c54b65de42268608c1ec484c31cb",
          col_value: this.state.signUpForm.contacts,
        },
        {
          asset_id: "53ac47fb-ff00-55ae-3a1a-13724bacd841",
          col_datatype: 0,
          col_name: "a6c2e619ca3dc1864b26dbebb26522d5",
          col_value: this.state.signUpForm.organizationName,
        },
        {
          asset_id: "53ac47fb-ff00-55ae-3a1a-13724bacd841",
          col_datatype: 0,
          col_name: "f55f3110813104923bf0efda81a317fb",
          col_value: this.state.signUpForm.contactsPhone,
        },
        {
          asset_id: "53ac47fb-ff00-55ae-3a1a-13724bacd841",
          col_datatype: 0,
          col_name: "445f59fa2012aab2b88842524705f6a8",
          col_value: this.state.signUpForm.address,
        },
        {
          asset_id: "53ac47fb-ff00-55ae-3a1a-13724bacd841",
          col_datatype: 0,
          col_name: "445f59fa2012aab2b88842524705f6a8",
          col_value: "",
        },
        {
          asset_id: "53ac47fb-ff00-55ae-3a1a-13724bacd841",
          col_datatype: 6,
          col_name: "0f815475844d3050b27ae47a20676449",
          col_value: this.state.signUpForm.joinTime,
        },
        {
          asset_id: "53ac47fb-ff00-55ae-3a1a-13724bacd841",
          col_datatype: 0,
          col_name: "cb82f0d410f31fbfa958e1b33a1f6d11",
          col_value: this.state.signUpForm.operationMessage,
        },
      ],
    };
    signUpSearch(asset_id, submitInfo)
      .then((res) => {
        if (res.status == 200) {
          if (res.data[1].length == 0) {
            formSubmit(form_id, messageInfo)
              .then((res) => {
                if (res.status == 200) {
                  this.setState({
                    goFirstInfoShow: 0,
                  });
                  this.getFirstListOne();
                } else {
                  message.info(res.message);
                }
              })
              .catch((res) => {
                if (res.data.status == 200) {
                  this.setState({
                    goFirstInfoShow: 0,
                  });
                  this.getFirstListOne();
                } else {
                  message.error(res.data.message);
                }
              });
          } else {
            message.error("您的社会组织已报名过该工会项目!");
          }
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };
  showTime = (date) => {
    let message = this.state.signUpForm;
    message.joinTime = Date.parse(date._d);
    this.setState({
      signUpForm: message,
    });
  };
  goSignUpView = () => {
    let date = this.state.signUpForm;
    date.joinTime = Date.parse(new Date());
    this.setState({
      goFirstInfoShow: 3,
      signUpForm: date,
    });
    const asset_id = "b3ae0ec8-4aa8-3657-74f0-6aca5299e66c";
    const message = {
      columnNames: ["organization_name"],
      filters: [
        {
          column: "create_member",
          compareObj: "$current_user_id",
          datatype: 0,
          satisfy_type: 0,
          type: 4,
          varibleType: "varibles",
        },
      ],
      sorts: [],
    };
    signUpSearch(asset_id, message).then((res) => {
      let data = JSON.parse(JSON.stringify(this.state.signUpForm));
      data.organizationName = res.data[1][0][0];
      this.setState({
        signUpForm: data,
      });
      const message2 = {
        columnNames: ["contacts"],
        filters: [
          {
            column: "organization_name",
            compareObj: this.state.signUpForm.organizationName,
            datatype: 0,
            satisfy_type: 0,
            type: 4,
            varibleType: "components",
          },
        ],
        sorts: [],
      };
      signUpSearch(asset_id, message2).then((res) => {
        let data2 = JSON.parse(JSON.stringify(this.state.signUpForm));
        data2.contacts = res.data[1][0][0];
        this.setState({
          signUpForm: data2,
        });
        const message3 = {
          columnNames: ["contact_number"],
          filters: [
            {
              column: "organization_name",
              compareObj: this.state.signUpForm.organizationName,
              datatype: 0,
              satisfy_type: 0,
              type: 4,
              varibleType: "components",
            },
          ],
          sorts: [],
        };
        signUpSearch(asset_id, message3).then((res) => {
          let data3 = JSON.parse(JSON.stringify(this.state.signUpForm));
          data3.contactsPhone = res.data[1][0][0];
          this.setState({
            signUpForm: data3,
          });
          const message4 = {
            columnNames: ["organization_address"],
            filters: [
              {
                column: "organization_name",
                compareObj: this.state.signUpForm.organizationName,
                datatype: 0,
                satisfy_type: 0,
                type: 4,
                varibleType: "components",
              },
            ],
            sorts: [],
          };
          signUpSearch(asset_id, message4).then((res) => {
            let data4 = JSON.parse(JSON.stringify(this.state.signUpForm));
            data4.address = res.data[1][0][0];
            this.setState({
              signUpForm: data4,
            });
            console.log(this.state.signUpForm);
          });
        });
      });
    });
  };
  getFirstListOne = () => {
    let idOne = "6311bb1d-02a3-fa94-bc93-dcddb598e2dc";
    let analysis_idOne = "ff9ff17e-df48-4c41-a1b3-f29db48e55ca";
    let idTwo = "e04e3ba6-120d-0578-619c-dcf4a840cc2f";
    let analysis_idTwo = "556efba9-9bcd-4cda-89c0-3b9f9204424c";
    let idThree = "e7f98a6d-8611-b2eb-2839-f885cec11a17";
    let analysis_idThree = "3f1a464f-a003-4fab-a5cc-d2d911b65343";
    getFirtsListOne(idOne, analysis_idOne, datasOne)
      .then((res) => {
        if (res.status == 200) {
          let message = JSON.parse(JSON.stringify(res.data.chartData));
          message.splice(0, 1);
          if (message.length > 0) {
            message.forEach((element, index) => {
              let regex = /\[(.+?)\]/g;
              element[1] = element[0].match(regex)[0].replace("[", "").replace("]", "");
              let p = element[1].split("?")[1];
              let params = new URLSearchParams(p);
              element[1] = params.get("id");
              element[0] = element[0].substring(0, element[0].indexOf("["));
            });
            this.setState({
              firstListOne: message,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    getFirtsListOne(idTwo, analysis_idTwo, datasTwo)
      .then((res) => {
        if (res.status == 200) {
          let message = JSON.parse(JSON.stringify(res.data.chartData));
          message.splice(0, 1);
          if (message.length > 0) {
            message.forEach((element, index) => {
              let regex = /\[(.+?)\]/g;
              element[1] = element[0].match(regex)[0].replace("[", "").replace("]", "");
              let p = element[1].split("?")[1];
              let params = new URLSearchParams(p);
              element[1] = params.get("id");
              element[0] = element[0].substring(0, element[0].indexOf("["));
            });
            this.setState({
              firstListTwo: message,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    getFirtsListOne(idThree, analysis_idThree, datasThree)
      .then((res) => {
        if (res.status == 200) {
          let message = JSON.parse(JSON.stringify(res.data.chartData));
          message.splice(0, 1);
          if (message.length > 0) {
            message.forEach((element, index) => {
              let regex = /\[(.+?)\]/g;
              element[1] = element[0].match(regex)[0].replace("[", "").replace("]", "");
              let p = element[1].split("?")[1];
              let params = new URLSearchParams(p);
              element[1] = params.get("id");
              element[0] = element[0].substring(0, element[0].indexOf("["));
            });
            this.setState({
              firstListThree: message,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // 获取首页第二个列表
  getFirtsListTwo = (asset_id, index) => {
    getFirtsListTwo(asset_id, index).then((res) => {
      let message = [];
      if (index == 1) {
        message = res.data[1].sort(this.compareOneTop());
      } else if (index == 2) {
        message = res.data[1].sort(this.compareOneCenter());
      } else {
        message = res.data[1].sort(this.compareOneBottom());
      }
      this.setState({
        firstSecondList: message,
      });
    });
  };
  // 获取政策法规列表
  getTwoList = () => {
    let asset_id = "31a6c650-ef94-73fa-10dc-58d30c1d1c0f";
    getTwoList(asset_id).then((res) => {
      const message = res.data[1].sort(this.compareTwo());
      this.setState({
        twoList: message,
      });
    });
  };
  // 政策法规详情
  goTwoInfo = (item) => {
    let view_id = "034fed5baa2e4fb4b9985b655027ba98";
    getDocInfo(view_id, item[0]).then((res) => {
      this.setState({
        docLinkDate: res.data["342b766d-5c2a-4222-87aa-17cdb42bc3fb"] ? JSON.parse(res.data["342b766d-5c2a-4222-87aa-17cdb42bc3fb"]) : [],
        twoInfoDate: res.data,
        twoInfoShow: !this.state.twoInfoShow,
      });
    });
    const serve_id = "9830a921-48fe-470e-85a2-d7be3abc59f9";
    const message = {
      param: `{\"data_id\":\"${item[0]}\"}`,
    };
    browseUp(serve_id, message).then((res) => {
      if (res.code == 200) {
        console.log("+1");
      } else {
        console.log("+1 error");
      }
    });
  };
  // 工作动态列表
  getThreeList = () => {
    let asset_id = "4b0152ba-db36-f4dc-73fc-1fa5787e77bd";
    getThreeList(asset_id).then((res) => {
      const message = res.data[1].sort(this.compareThree());
      this.setState({
        threeList: message,
      });
    });
  };
  // 工作动态详情
  goThreeInfo = (item) => {
    let view_id = "2057c5f1e5574a1a9ca60a78fccc25f5";
    getDocInfo(view_id, item[0]).then((res) => {
      this.setState({
        docLinkDate: res.data["b410176a-69ef-494e-ae57-49bc3875e639"] ? JSON.parse(res.data["b410176a-69ef-494e-ae57-49bc3875e639"]) : [],
        threeInfoDate: res.data,
        threeInfoShow: !this.state.threeInfoShow,
      });
    });
    const serve_id = "ad2859c3-9937-4614-85a2-676b6f878399";
    const message = {
      param: `{\"data_id\":\"${item[0]}\"}`,
    };
    browseUp(serve_id, message).then((res) => {
      if (res.code == 200) {
        console.log("+1");
      } else {
        console.log("+1 error");
      }
    });
  };
  // 公告通知列表
  getFourList = () => {
    let asset_id = "b5d32a6a-3bf0-7d37-34e3-ac7abca76abf";
    getFourList(asset_id).then((res) => {
      const message = res.data[1].sort(this.compareFour());
      this.setState({
        fourList: message,
      });
    });
  };
  // 公告通知详情
  goFourInfo = (item) => {
    let view_id = "9c01edefbe5b4bedaa0f4f6f53da6ded";
    getDocInfo(view_id, item[0]).then((res) => {
      this.setState({
        docLinkDate: res.data["6f7674e1-e02e-4faf-af83-a6bc2a4e90a6"] ? JSON.parse(res.data["6f7674e1-e02e-4faf-af83-a6bc2a4e90a6"]) : [],
        fourInfoDate: res.data,
        fourInfoShow: !this.state.fourInfoShow,
      });
    });
    const serve_id = "beb81d04-7f4e-45d3-aae9-2aa3671ed12e";
    const message = {
      param: `{\"data_id\":\"${item[0]}\"}`,
    };
    browseUp(serve_id, message).then((res) => {
      if (res.code == 200) {
        console.log("+1");
      } else {
        console.log("+1 error");
      }
    });
  };
  // 从首页第一个列表上面进第二个列表
  goFirstTopInfo = () => {
    this.setState({
      goFirstInfoShow: 1,
    });
    let asset_id = "6311bb1d-02a3-fa94-bc93-dcddb598e2dc";
    this.getFirtsListTwo(asset_id, 1);
  };
  // 从首页第一个列表中间进第二个列表
  goFirstCenterInfo = () => {
    this.setState({
      goFirstInfoShow: 1,
    });
    let asset_id = "e04e3ba6-120d-0578-619c-dcf4a840cc2f";
    this.getFirtsListTwo(asset_id, 2);
  };
  // 从首页第一个列表下面进第二个列表
  goFirsButtomtInfo = () => {
    this.setState({
      goFirstInfoShow: 1,
    });
    let asset_id = "636a2bdd-0f5e-088b-3cd5-a2fb7ec9fb07";
    this.getFirtsListTwo(asset_id, 3);
  };
  // 首页第二个列表进入详情
  goFirstListInfo = (item) => {
    let view_id = "";
    if (this.state.firstSecondList[0].length == 44) {
      this.setState({
        topCenterBottom: 0,
      });
      view_id = "e5b5cffcd279445b8680f523557c003c";
    } else if (this.state.firstSecondList[0].length == 32) {
      this.setState({
        topCenterBottom: 2,
      });
      view_id = "b08ed5ae62524548b3be5933de7f9784";
    } else {
      this.setState({
        topCenterBottom: 1,
      });
      view_id = "17544889f246420fa05f6ff056bef01b";
    }

    getDocInfo(view_id, item[0]).then((res) => {
      if (view_id == "b08ed5ae62524548b3be5933de7f9784") {
        this.setState({
          firstInfoDateBottom: res.data,
          goFirstInfoShow: 2,
          topCenterBottom: 2,
        });
      } else if (view_id == "e5b5cffcd279445b8680f523557c003c") {
        this.setState({
          firstInfoDateTop: res.data,
          goFirstInfoShow: 2,
          topCenterBottom: 0,
        });
      } else {
        this.setState({
          firstInfoDateCenter: res.data,
          goFirstInfoShow: 2,
          topCenterBottom: 1,
        });
      }
    });
  };
  // 从首页第一个列表上面直接进详情
  goFirstInfoFromOne = (item) => {
    this.goFirstInfoShow = 2;
    this.topCenterBottom = 0;
    let view_id = "e5b5cffcd279445b8680f523557c003c";
    getDocInfo(view_id, item[1]).then((res) => {
      this.setState({
        firstInfoDateTop: res.data,
        goFirstInfoShow: 2,
        topCenterBottom: 0,
      });
    });
  };
  // 从首页第一个列表中间直接进详情
  goFirstInfoFromTwo = (item) => {
    this.goFirstInfoShow = 2;
    this.topCenterBottom = 1;
    let view_id = "17544889f246420fa05f6ff056bef01b";
    getDocInfo(view_id, item[1]).then((res) => {
      this.setState({
        firstInfoDateCenter: res.data,
        goFirstInfoShow: 2,
        topCenterBottom: 1,
      });
    });
  };
  // 从首页第一个列表下面直接进详情
  goFirstInfoFromThree = (item) => {
    let view_id = "b08ed5ae62524548b3be5933de7f9784";
    getDocInfo(view_id, item[1]).then((res) => {
      this.setState({
        firstInfoDateBottom: res.data,
        goFirstInfoShow: 2,
        topCenterBottom: 2,
      });
    });
  };
  // 处理时间
  formateDate = (time, fmt) => {
    let date = new Date(time);
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    let o = {
      "Y+": date.getFullYear(),
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
    };
    if (isNaN(o["Y+"])) {
      return o["Y+"];
    } else {
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + "";
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : str);
        }
      }
      return fmt;
    }
  };

  compareOneTop = () => {
    return function (a, b) {
      var value1 = a[18];
      var value2 = b[18];
      return value2 - value1;
    };
  };
  compareOneCenter = () => {
    return function (a, b) {
      var value1 = a[10];
      var value2 = b[10];
      console.log(value2, value1);
      return value2 - value1;
    };
  };
  compareOneBottom = () => {
    return function (a, b) {
      var value1 = a[17];
      var value2 = b[17];
      console.log(value2, value1);
      return value2 - value1;
    };
  };
  compareTwo = () => {
    return function (a, b) {
      var value1 = a[10];
      var value2 = b[10];
      return value2 - value1;
    };
  };
  compareThree = () => {
    return function (a, b) {
      var value1 = a[18];
      var value2 = b[18];
      return value2 - value1;
    };
  };
  compareFour = () => {
    return function (a, b) {
      var value1 = a[18];
      var value2 = b[18];
      return value2 - value1;
    };
  };
  formRef = React.createRef();
  onGenderChange = (value) => {
    switch (value) {
      case "male":
        setTimeout(() => {
          this.formRef.current.setFieldsValue({
            note: "Hi, man!",
          });
        }, 100);

        return;

      case "female":
        setTimeout(() => {
          this.formRef.current.setFieldsValue({
            note: "Hi, lady!",
          });
        }, 100);
        return;

      case "other":
        setTimeout(() => {
          this.formRef.current.setFieldsValue({
            note: "Hi, there!",
          });
        }, 100);
    }
  };
  // 打开附件
  goLink = (item) => {
    window.open(item.url, "_black");
  };
  render() {
    const { title, desc, imgUrl } = this.props;

    return (
      <div>
        <img
          className="topImg"
          src={require("././assets/img/backgroundImg.png").default}
          // style={{backgroundImage:}}
        ></img>
        <Tabs className="tabsCard" defaultActiveKey="1" onTabClick={this.callback}>
          <TabPane tab="首页" key="1">
            <div className="firtsListOne" style={{ display: this.state.goFirstInfoShow == 0 ? "block" : "none" }}>
              <div className="firtsListOneCard">
                <div className="firtsListOneTop">
                  <div className="firtsListOneTopTilte">社会组织服务</div>
                  <span className="firtsListOneTopMore" onClick={this.goFirstTopInfo}>
                    更多
                  </span>
                </div>
                <div className="firtsListOneInfo">
                  {this.state.firstListOne.map((item, index) => {
                    return (
                      <span key={index} onClick={this.goFirstInfoFromOne.bind(this, item)}>
                        {item[0]}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="firtsListOneCard">
                <div className="firtsListOneTop">
                  <div className="firtsListOneTopTilte">工会项目</div>
                  <span className="firtsListOneTopMore" onClick={this.goFirstCenterInfo}>
                    更多
                  </span>
                </div>
                <div className="firtsListOneInfo">
                  {this.state.firstListTwo.map((item, index) => {
                    return (
                      <span key={index} onClick={this.goFirstInfoFromTwo.bind(this, item)}>
                        {item[0]}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="firtsListOneCard">
                <div className="firtsListOneTop">
                  <div className="firtsListOneTopTilte">职工需求</div>
                  <span className="firtsListOneTopMore" onClick={this.goFirsButtomtInfo}>
                    更多
                  </span>
                </div>
                <div className="firtsListOneInfo">
                  {this.state.firstListThree.map((item, index) => {
                    return (
                      <span key={index} onClick={this.goFirstInfoFromThree.bind(this, item)}>
                        {item[0]}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <ConfigProvider locale={zhCN}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ display: this.state.goFirstInfoShow == 1 && this.state.firstSecondList.length == 0 ? "block" : "none" }} />
            </ConfigProvider>
            <div className="currency" style={{ display: this.state.goFirstInfoShow == 1 && this.state.firstSecondList.length > 0 ? "block" : "none" }}>
              {this.state.firstSecondList.map((item, index) => {
                return (
                  <div key={index} className="currencyCard">
                    <div className="currencyLeft">
                      <div
                        className="currencyLeftTitle"
                        style={{ display: this.state.firstSecondList[0].length == 44 ? "block" : "none" }}
                        onClick={this.goFirstListInfo.bind(this, item)}
                      >
                        {item[15]}
                      </div>
                      <div
                        className="currencyLeftTitle"
                        style={{ display: this.state.firstSecondList[0].length == 32 ? "block" : "none" }}
                        onClick={this.goFirstListInfo.bind(this, item)}
                      >
                        {item[15]}
                      </div>
                      <div
                        className="currencyLeftTitle"
                        style={{ display: this.state.firstSecondList[0].length == 30 ? "block" : "none" }}
                        onClick={this.goFirstListInfo.bind(this, item)}
                      >
                        {item[1]}
                      </div>
                      <div className="currencyLeftInfo">
                        <span style={{ display: this.state.firstSecondList[0].length == 32 ? "block" : "none" }}>
                          {this.formateDate(item[17], "YYYY-MM-dd")}-{this.formateDate(item[18], "YYYY-MM-dd")}
                        </span>
                        <span style={{ display: this.state.firstSecondList[0].length == 44 ? "block" : "none" }}>
                          {this.formateDate(item[18], "YYYY-MM-dd")}-{this.formateDate(item[19], "YYYY-MM-dd")}
                        </span>
                        <span style={{ display: this.state.firstSecondList[0].length == 30 ? "block" : "none" }}>
                          {this.formateDate(item[10], "YYYY-MM-dd")}-{this.formateDate(item[13], "YYYY-MM-dd")}
                        </span>
                        <span style={{ display: this.state.firstSecondList[0].length == 32 ? "block" : "none" }}> {item[43]}</span>
                        <span style={{ display: this.state.firstSecondList[0].length == 44 ? "block" : "none" }}> {item[43]}</span>
                        <span style={{ display: this.state.firstSecondList[0].length == 30 ? "block" : "none" }}> {item[43]}</span>
                      </div>
                    </div>
                    <div className="currencyRight">
                      <RightCircleOutlined onClick={this.goFirstListInfo.bind(this, item)}></RightCircleOutlined>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="firstInfo" style={{ display: this.state.goFirstInfoShow == 2 ? "block" : "none" }}>
              <div className="buttomInfo" style={{ display: this.state.topCenterBottom == 0 ? "block" : "none" }}>
                <div className="InfoLable">
                  <div>服务名称</div>
                  <div>{this.state.firstInfoDateTop["71ee2e407e74d95e36e758b2db0e3cf9"]}</div>
                </div>
                <div className="InfoLable">
                  <div>服务类型</div>
                  <div>{this.state.firstInfoDateTop["d2b3971c0ada086aabcaa3526859986d"]}</div>
                </div>
                <div className="InfoLable">
                  <div>开始时间</div>
                  <div>{this.formateDate(this.state.firstInfoDateTop["d1d82e0f2a9d4bf553ffb0c52050027a"], "YYYY-MM-dd hh:mm:ss")}</div>
                </div>
                <div className="InfoLable">
                  <div>截止时间</div>
                  <div>{this.formateDate(this.state.firstInfoDateTop["cd8a8e76754dcda6c841710d5de2e8a5"], "YYYY-MM-dd hh:mm:ss")}</div>
                </div>
                <div className="InfoLable">
                  <div>联系人</div>
                  <div>{this.state.firstInfoDateTop["273809ecc5f2e2d59bf11832b0610872"]}</div>
                </div>
                <div className="InfoLable">
                  <div>联系电话</div>
                  <div>{this.state.firstInfoDateTop["d206f10a112d5951468129a2dc5ac489"]}</div>
                </div>
                <div className="InfoLable">
                  <div>可提供服务描述</div>
                  <div>{this.state.firstInfoDateTop["ac41fe9822916fd944540fa63c363b42"]}</div>
                </div>
                <div className="InfoLable">
                  <div>状态</div>
                  <div>{this.state.firstInfoDateTop["86612f71c15eb05ff1868bba3961b61e"]}</div>
                </div>
              </div>
              <div className="buttomInfo" style={{ display: this.state.topCenterBottom == 1 ? "block" : "none" }}>
                <div className="InfoLable">
                  <div>项目名称</div>
                  <div>{this.state.firstInfoDateCenter["ce4fbd69006e62b48a3e1f081be76fc5"]}</div>
                </div>
                <div className="InfoLable">
                  <div>项目类型</div>
                  <div>{this.state.firstInfoDateCenter["4e230f4cbe41b02f6b5e9f95564a50a2"]}</div>
                </div>
                <div className="InfoLable">
                  <div>开始时间</div>
                  <div>{this.formateDate(this.state.firstInfoDateCenter["cc56925d8df099fc2c93a8b6217ec9a1"], "YYYY-MM-dd hh:mm:ss")}</div>
                </div>
                <div className="InfoLable">
                  <div>截止时间</div>
                  <div>{this.formateDate(this.state.firstInfoDateCenter["b7a95514da325975a0d72a65d7764113"], "YYYY-MM-dd hh:mm:ss")}</div>
                </div>
                <div className="InfoLable">
                  <div>项目所在地市</div>
                  <div>
                    {this.state.firstInfoDateCenter["5b9f10e153494b0de95af000d3b9e721"] +
                      this.state.firstInfoDateCenter["ca9e161d01785107d415a52bd6ba0f00"] +
                      this.state.firstInfoDateCenter["a1f7b5962d58224a328fa208e28d9f56"]}
                  </div>
                </div>
                <div className="InfoLable">
                  <div>项目联系人</div>
                  <div>{this.state.firstInfoDateCenter["40c1f3ed78c54cbdfb2dbabffefc2045"]}</div>
                </div>
                <div className="InfoLable">
                  <div>联系电话</div>
                  <div>{this.state.firstInfoDateCenter["4e8f2181-b2ed-4c45-aa2c-80cb2b8fcf8e"]}</div>
                </div>
                <div className="InfoLable">
                  <div>项目描述</div>
                  <div>{this.state.firstInfoDateCenter["ca33e7390a1f512667ed492082f4e760"]}</div>
                </div>
                <div className="InfoLable">
                  <div>状态</div>
                  <div>{this.state.firstInfoDateCenter["57f4cc39-81fd-4830-90a0-34dbad58d5b4"]}</div>
                </div>
                <div className="InfoLable" onClick={this.goSignUpView}>
                  <Button className="saveBt">报名</Button>
                </div>
              </div>

              <div className="buttomInfo" style={{ display: this.state.topCenterBottom == 2 ? "block" : "none" }}>
                <div className="InfoLable">
                  <div>标题</div>
                  <div>{this.state.firstInfoDateBottom["fe07ad795a194ebdae7f5991a5f80f3f"]}</div>
                </div>
                <div className="InfoLable">
                  <div>需求类型</div>
                  <div>{this.state.firstInfoDateBottom["2b09ebda-58e4-4bd8-9b14-0614f266d9e4"]}</div>
                </div>
                <div className="InfoLable">
                  <div>开始时间</div>
                  <div>{this.formateDate(this.state.firstInfoDateBottom["3f546639259fd41a9961bb647c948041"], "YYYY-MM-dd hh:mm:ss")}</div>
                </div>
                <div className="InfoLable">
                  <div>结束时间</div>
                  <div>{this.formateDate(this.state.firstInfoDateBottom["530ef9f6c02573f92ea5c4cfcfd9018e"], "YYYY-MM-dd hh:mm:ss")}</div>
                </div>
                <div className="InfoLable">
                  <div>所在地市</div>
                  <div>
                    {this.state.firstInfoDateBottom["6c8002cb-806c-49f1-beef-ea0f906df387"] +
                      this.state.firstInfoDateBottom["d21b478f-1d74-4c42-80da-2d521d03fc8b"] +
                      this.state.firstInfoDateBottom["0ffd17f2-b08e-4119-92ea-0a3ffee1ac65"]}
                  </div>
                </div>
                <div className="InfoLable">
                  <div>需求描述</div>
                  <div>{this.state.firstInfoDateBottom["9f14b931-28cf-447d-b46b-1eb73dc8d1c2"]}</div>
                </div>
              </div>
            </div>
            <div className="firstInfo" style={{ display: this.state.goFirstInfoShow == 3 ? "block" : "none" }}>
              <div className="submitBt">
                <Button className="saveBt" onClick={this.submitFinish}>
                  保存
                </Button>
              </div>
              <Form name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} autoComplete="off">
                <Form.Item label="组织名称" name="organizationName" rules={[{ required: true, message: "Please input your username!" }]}>
                  <Select placeholder={this.state.signUpForm.organizationName} disabled onChange={this.onGenderChange} allowClear>
                    <Option value="male">male</Option>
                    <Option value="female">female</Option>
                    <Option value="other">other</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="联系人" name="contacts" rules={[{ required: true, message: "Please input your username!" }]}>
                  <Input disabled placeholder={this.state.signUpForm.contacts} />
                </Form.Item>
                <Form.Item label="联系电话" name="contactsPhone" rules={[{ required: true, message: "Please input your username!" }]}>
                  <Input disabled placeholder={this.state.signUpForm.contactsPhone} />
                </Form.Item>
                <Form.Item label="联系地址" name="address" rules={[{ required: true, message: "Please input your username!" }]}>
                  <Input disabled placeholder={this.state.signUpForm.address} />
                </Form.Item>
                <Form.Item label="参与时间" name="joinTime" rules={[{ required: true, message: "Please input your username!" }]}>
                  <DatePicker defaultValue={moment()} onChange={this.showTime} showTime />
                </Form.Item>
                <Form.Item label="合作留言" name="operationMessage">
                  <TextArea />
                </Form.Item>
              </Form>
            </div>
          </TabPane>
          <TabPane tab="政策法规" key="2">
            <ConfigProvider locale={zhCN}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ display: this.state.twoInfoShow && this.state.twoList.length == 0 ? "block" : "none" }} />
            </ConfigProvider>
            <div className="currency" style={{ display: this.state.twoInfoShow && this.state.twoList.length > 0 ? "block" : "none" }}>
              {this.state.twoList.map((item, index) => {
                return (
                  <div key={index} className="currencyCard">
                    <div className="currencyLeft">
                      <div className="currencyLeftTitle" onClick={this.goTwoInfo.bind(this, item)}>
                        {item[1]}
                      </div>
                      <div className="currencyLeftInfo">
                        <span> {item[2]}</span>
                      </div>
                    </div>
                    <div className="currencyRight">
                      <RightCircleOutlined onClick={this.goTwoInfo.bind(this, item)}></RightCircleOutlined>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: !this.state.twoInfoShow ? "block" : "none" }} className="currencyInfo">
              <div className="buttomInfo">
                <h4>{this.state.twoInfoDate["874e0bee7c23c17670824c15b98fa7b7"]}</h4>
                <span>发布来源：{this.state.twoInfoDate["a7b0186b-bc0c-4669-af58-b6525b520477"]}</span>
                <br />
                <span>
                  发布日期:
                  {this.formateDate(this.state.twoInfoDate["00bc5bc7c4643b243e96a750228c004c"], "YYYY-MM-dd")}
                </span>
                <br />
                <span>浏览次数：{this.state.twoInfoDate["343e06c1-94d7-4260-b0e1-85f93555b0ab"] + 1}</span>
                <p dangerouslySetInnerHTML={{ __html: this.state.twoInfoDate["0adc798bff051331abe8fc4b124de215"] }} className="mainInfo" />
                附件：
                {this.state.docLinkDate.map((item, index) => {
                  return (
                    <p className="enclosure" onClick={this.goLink.bind(this, item)} key={index}>
                      {item.name}
                    </p>
                  );
                })}
              </div>
            </div>
          </TabPane>
          <TabPane tab="工作动态" key="3">
            <ConfigProvider locale={zhCN}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ display: this.state.threeInfoShow && this.state.threeList.length == 0 ? "block" : "none" }} />
            </ConfigProvider>
            <div className="currency" style={{ display: this.state.threeInfoShow && this.state.threeList.length > 0 ? "block" : "none" }}>
              {this.state.threeList.map((item, index) => {
                return (
                  <div key={index} className="currencyCard">
                    <div className="currencyLeft">
                      <div className="currencyLeftTitle" onClick={this.goThreeInfo.bind(this, item)}>
                        {item[1]}
                      </div>
                      <div className="currencyLeftInfo">
                        <span> {item[2]}</span>
                      </div>
                    </div>
                    <div className="currencyRight">
                      <RightCircleOutlined onClick={this.goThreeInfo.bind(this, item)}></RightCircleOutlined>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="currencyInfo" style={{ display: !this.state.threeInfoShow ? "block" : "none" }}>
              <div className="buttomInfo">
                <h4>{this.state.threeInfoDate["485c5d7bb5befe229d290f644ac2a52c"]}</h4>
                <span>发布来源：{this.state.threeInfoDate["ded22a86-ffa5-4c78-9c79-0244ad066788"]}</span>
                <br />
                <span>
                  发布日期:
                  {this.formateDate(this.state.threeInfoDate["b1143c0bb11ae45178803f6d07f86916"], "YYYY-MM-dd")}
                </span>
                <br />
                <span>浏览次数：{this.state.threeInfoDate["bb0e3b13-5390-4d09-b1f2-67c4d04c2acf"] + 1}</span>
                <p dangerouslySetInnerHTML={{ __html: this.state.threeInfoDate["a4adceb3-7d71-4361-a0e3-8cd52cd4bd5f"] }} className="mainInfo" />
                附件：
                {this.state.docLinkDate.map((item, index) => {
                  return (
                    <p className="enclosure" onClick={this.goLink.bind(this, item)} key={index}>
                      {item.name}
                    </p>
                  );
                })}
              </div>
            </div>
          </TabPane>
          <TabPane tab="公告通知" key="4">
            <ConfigProvider locale={zhCN}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ display: this.state.fourInfoShow && this.state.fourList.length == 0 ? "block" : "none" }} />
            </ConfigProvider>
            <div className="currency" style={{ display: this.state.fourInfoShow && this.state.fourList.length > 0 ? "block" : "none" }}>
              {this.state.fourList.map((item, index) => {
                return (
                  <div key={index} className="currencyCard">
                    <div className="currencyLeft">
                      <div className="currencyLeftTitle" onClick={this.goFourInfo.bind(this, item)}>
                        {item[1]}
                      </div>
                      <div className="currencyLeftInfo">
                        <span> {item[2]}</span>
                      </div>
                    </div>
                    <div className="currencyRight">
                      <RightCircleOutlined onClick={this.goFourInfo.bind(this, item)}></RightCircleOutlined>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="currencyInfo" style={{ display: !this.state.fourInfoShow ? "block" : "none" }}>
              <div className="buttomInfo">
                <h4>{this.state.fourInfoDate["54f4b602d8bf18d85d724ab8f3733930"]}</h4>
                <span>发布来源：{this.state.fourInfoDate["1527e7b7-f207-4c6b-929f-53faaac2ce03"]}</span>
                <br />
                <span>
                  发布日期:
                  {this.formateDate(this.state.fourInfoDate["7fcf3f8ab442919d703c184850c43844"], "YYYY-MM-dd")}
                </span>
                <br />
                <span>浏览次数：{this.state.fourInfoDate["3d9e2f0e-239d-48b7-99a0-8223cc6667e9"] + 1}</span>
                <p dangerouslySetInnerHTML={{ __html: this.state.fourInfoDate["773a9e415465c0e4423c116c385e477c"] }} className="mainInfo" />
                附件：
                {this.state.docLinkDate.map((item, index) => {
                  return (
                    <p className="enclosure" onClick={this.goLink.bind(this, item)} key={index}>
                      {item.name}
                    </p>
                  );
                })}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
