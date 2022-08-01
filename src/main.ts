import { createApp, h } from "vue";
import App from "./App.vue";

type Config = {
  domId: string;
};

import config from "../pluginTemp/config.json";
let { domId } = Object.values(config)[0] as Config;
let dom = document.getElementById(domId);
if (dom) {
  if (dom.childNodes.length > 0) {
    dom.removeChild(dom.childNodes[0]);
  }
  let wrapper = document.createElement("div");
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";
  dom.appendChild(wrapper);
  createApp(App).mount(wrapper);
} else {
  if (process.env.NODE_ENV !== "production") {
    require("./index.css");
    require("../public/jsencrypt");
    const { props, account } = require("./mockData");

    // 自动登录，获取token
    const { isLogin, login } = require("./api/asset");
    if (account.user && account.password) {
      isLogin()
        .then((res: { data: any }) => {
          if (!res.data) {
            const PUBLIC_KEY =
              "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANNmSJW87EE2Z3KDW5Kod8cL + 7lUBgfKLm86CGfMQxvc8w + JnOE7GV72DVyg2kCMGho5g9AR64BmrGobbG4xMZECAwEAAQ ==";
            const Encrypt = (text: string) => {
              if (!text) {
                return;
              }
              const encrypt = new window.JSEncrypt();
              encrypt.setPublicKey(
                "-----BEGIN PUBLIC KEY-----" +
                  PUBLIC_KEY +
                  "-----END PUBLIC KEY-----"
              );
              const encrypted = encrypt.encrypt(text);
              return encrypted.toString();
            };
            login({
              account: account.user,
              username: account.user,
              password: Encrypt(account.password),
            })
              .then((res: { data: any }) => {
                window.token = res.data;
              })
              .catch((err: any) => {
                console.log(err);
                console.error("登录失败，接口无法调用！");
              })
              .finally(() => {
                createApp(h(App, props)).mount("#app");
              });
          } else {
            createApp(h(App, props)).mount("#app");
          }
        })
        .catch((err: any) => {
          console.log("err", err);
          createApp(h(App, props)).mount("#app");
        });
    } else {
      console.log(
        "若需要调用平台接口，请在 src/mockData.ts 文件中输入用户名和密码！"
      );
      createApp(h(App, props)).mount("#app");
    }
  } else {
    if (!window.CUSTOM_PLUGIN) {
      window.CUSTOM_PLUGIN = new Map();
    }
    window.CUSTOM_PLUGIN.set(
      process.env.VUE_APP_CUSTOM_PLUGIN_ID,
      (dom: HTMLElement, props: object) => {
        if (dom.childNodes.length > 0) {
          dom.removeChild(dom.childNodes[0]);
        }
        const div = document.createElement("div");
        dom.appendChild(div);
        createApp(h(App, props)).mount(div);
      }
    );
  }
}
