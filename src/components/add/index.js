import React, { Component } from "react";
// import axios from 'axios'
import {
  getContentData,
  accessToken,
  upload,
  callBackDoc,
} from "../../../src/api/asset";
import "../add/index.css";
// import ReactDOM from 'react-dom'
import { Button, Modal } from "antd";
import axios from "axios";
export default class App extends Component {
  state = {
    flag: false,
    tabData: [],
    contentData: [],
    currentIndex: 0,
    showMaskIndex: 0,
    maskeShow: true,
    url: "",
    modalVisible: false,
    gzcaToken: "",
  };
  change = () => {
    this.setState({ flag: true });
    let url = window.location.href;
    let p = url.split("?")[1];
    console.log(p, url);
    let obj = new URLSearchParams(p);
    console.log(obj);
    getContentData({
      dataId: obj.edit_id,
      formId: obj.id,
      viewId: obj.view_id,
      type: "2",
      isGenerate: "Y",
    })
      .then((res) => {
        let arr = [];
        res.data.forEach((item) => {
          arr.push(item.name);
          this.setState({ tabData: arr });
        });
        this.setState({ contentData: res.data });
      })
      .catch((error) => {
        console.log(error);
      });

    // getContentData({
    //   dataId: "b9074b452b1f403689458f813ade1400",
    //   viewId: "f855ba7ab91840e5a0c2618f8160f919",
    //   formId: "cfa49303cc374a6eb4a3a96ada283b49",
    //   type: "2",
    //   isGenerate: "Y",
    // }).then((res) => {
    //   console.log(res);
    //   let arr = [];
    //   res.data.forEach((item) => {
    //     arr.push(item.name);
    //     this.setState({ tabData: arr });
    //   });
    //   this.setState({ contentData: res.data });
    // });
  };
  closeMask = () => {
    this.setState({ flag: false, maskeShow: true });
  };
  switchTab = (i) => {
    this.setState({ currentIndex: i });
  };
  sureChapter = () => {
    // this.setState({ maskeShow: false, modalVisible: true });
    // 获取token
    accessToken(
      "https://wbtest.gzca.cc:52522/v2/api/token/getAccessToken"
    ).then((res) => {
      this.setState({ gzcaToken: res.data.token });
      let nowHerf = "";
      // 去除回到页面多余带参
      nowHerf = this.ridUrlParam(`${window.location.href}`, [
        "name_en",
        "protocal_id",
        "doc",
      ]);
      // 加上新的参
      nowHerf = `${nowHerf}&name_en=${
        this.state.contentData[this.state.currentIndex].name_en
      }&protocal_id=${
        this.state.contentData[this.state.currentIndex].protocal_id
      }`;
      let message = {
        docType: "1",
        docUrl: this.state.contentData[this.state.currentIndex].url, //要英文
        docData: "",
        gzcaToken: this.state.gzcaToken,
        sealCert: "",
        signMode: "0",
        sealCode: "",
        returnURL: `${nowHerf}`, //要英文
        identNo: "",
        creditCode: "",
        signWay: [1, 2, 3],
      };
      // 调第三方接口
      axios
        .post(
          "https://esign.gzca.cc:61104/docsign/api/fore/doc/upload/",
          message
        )
        .then((res) => {
          window.location.replace(res.data.data.gotoURL);
          console.log(res.data.data);
        });
    });
  };
  // 去除URL指定参数
  ridUrlParam = (url, params) => {
    for (var index = 0; index < params.length; index++) {
      var item = params[index];
      var fromIndex = url.indexOf(item + "="); //必须加=号，避免参数值中包含item字符串
      if (fromIndex !== -1) {
        // 通过url特殊符号，计算出=号后面的的字符数，用于生成replace正则
        var startIndex = url.indexOf("=", fromIndex);
        var endIndex = url.indexOf("&", fromIndex);
        var hashIndex = url.indexOf("#", fromIndex);

        var reg = "";
        if (endIndex !== -1) {
          // 后面还有search参数的情况
          var num = endIndex - startIndex;
          reg = new RegExp(item + "=.{" + num + "}");
          url = url.replace(reg, "");
        } else if (hashIndex !== -1) {
          // 有hash参数的情况
          var num = hashIndex - startIndex - 1;
          reg = new RegExp("&?" + item + "=.{" + num + "}");
          url = url.replace(reg, "");
        } else {
          // search参数在最后或只有一个参数的情况
          reg = new RegExp("&?" + item + "=.+");
          url = url.replace(reg, "");
        }
      }
    }
    var noSearchParam = url.indexOf("=");
    if (noSearchParam === -1) {
      url = url.replace(/\?/, ""); // 如果已经没有参数，删除？号
    }
    return url;
  };
  changeMask1 = () => {
    this.setState({ maskeShow: true });
  };
  // 回调回到这个页面请求接口
  callbackDoThing = () => {
    let url = window.location.href;
    let p = url.split("?")[1];
    let obj = new URLSearchParams(p);
    if (obj.name_en && obj.protocal_id && obj.doc) {
      let message = {
        name_en: obj.name_en,
        protocal_id: obj.protocal_id,
        doc: obj.doc,
      };
      callBackDoc(message).then((res) => {
        console.log(res);
      });
    }
  };
  showModal = () => {
    this.setState({ modalVisible: true });
  };
  handleOk = () => {
    this.setState({ modalVisible: false });
  };
  handleCancel = () => {
    this.setState({ modalVisible: false });
  };
  bigStyle = {
    width: "90%",
    height: "90%",
    backgroundColor: "#fff",
    position: "fixed",
    top: "60px",
    left: "120px",
    display: "flex",
    justifyContent: "space-between",
    borderRadius: "15px",
    zIndex: "1000 !important",
  };
  maskStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    zIndex: "1000 !important",
    position: "fixed",
    top: 0,
    left: 0,
    opacity: "0.8",
  };
  render() {
    this.callbackDoThing();
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div>
          <Button onClick={this.change} type="primary">
            协议预览
          </Button>
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            float: "left",
            zIndex: "1000",
          }}
        >
          {this.state.flag ? (
            <div style={{ width: "100%", height: "100%" }}>
              <Modal
                title="Basic Modal"
                visible={this.state.modalVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              ></Modal>
              <div style={this.maskStyle}>
                <div
                  onClick={this.closeMask}
                  style={{
                    cursor: "pointer",
                    width: "50px",
                    height: "50px",
                    textAlign: "center",
                    float: "right",
                    lineHeight: "50px",
                    color: "#fff",
                    fontSize: "20px",
                  }}
                >
                  ×
                </div>
              </div>
              <div style={this.bigStyle}>
                <div
                  style={{
                    flex: 1,
                    borderRight: "1px solid #ccc",
                    marginLeft: "35px",
                  }}
                >
                  {this.state.tabData.map((item, index) => {
                    return (
                      <div
                        key={index}
                        style={{ margin: "30px 0", cursor: "pointer" }}
                        className={
                          this.state.currentIndex === index ? "active" : ""
                        }
                        onClick={() => {
                          this.switchTab(index);
                        }}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
                <div style={{ flex: 4, position: "relative" }}>
                  {this.state.contentData.map((item, index) => {
                    return this.state.currentIndex === index ? (
                      <div
                        key={index}
                        style={{ width: "100%", height: "100%" }}
                      >
                        <h1 style={{ textAlign: "center" }}>{item.name}</h1>
                        <div
                          style={{
                            overflow: "scroll",
                            width: "98%",
                            height: "82%",
                            wordBreak: "break-all",
                            marginLeft: "10px",
                          }}
                          className="scrollBar"
                        >
                          {/* <iframe
                            src="http://10.15.111.9:7217/storage_area/template/c138f94fcaf346d08df179eb05413780.pdf"
                            style={{ width: "100%", height: "100%" }}
                            scroll="true"
                          ></iframe> */}
                          <iframe
                            src={item.url}
                            style={{ width: "100%", height: "100%" }}
                            scroll="true"
                            className="IfRame"
                          ></iframe>
                        </div>
                      </div>
                    ) : null;
                  })}
                  {this.state.maskeShow ? (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "50px",
                        right: "50px",
                        width: "20%",
                        height: "40px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* 判断文档状态 */}
                      <button
                        style={{
                          display:
                            this.state.contentData[this.state.currentIndex]
                              .protocal_status == "1",
                        }}
                        onClick={this.sureChapter}
                      >
                        申请用章
                      </button>
                      {/* <button>签字</button>
                      <button>提交</button> */}
                      <button onClick={this.closeMask}>关闭</button>
                    </div>
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "50px",
                        right: "50px",
                        width: "20%",
                        height: "40px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <button onClick={this.changeMask1}>通过</button>
                      <button onClick={this.changeMask1}>拒绝</button>
                      <button onClick={this.closeMask}>关闭</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

// ReactDOM.render(<App />)
