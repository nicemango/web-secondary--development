import axios from "axios";
import qs from "querystringify";
import Pako from "pako";
let apiContextPath = "";
if (process.env.NODE_ENV === "development") {
  document.cookie =
    "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2MDAwODc0MDAwMCwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.dVJ1q1uYrzxE-zUIHGZNZqycNzgGgoBxMD-HIYD2c2U";
  document.cookie =
    "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY1OTc3Mjk1ODM3NX0.DDZUuwpfDCQsJgXyIAlVUdnCDCGBkmErKTYXK8396qg";
  document.cookie = "username=admin";
  document.cookie = "windowOnline=true";
  apiContextPath = "/api";
}
function Utf8ArrayToStr(array) {
  let out, i, len;
  let char2, char3;

  let c;

  out = " ";
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    // eslint-disable-next-line default-case
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
        );
        break;
    }
  }
  return out;
}

/**
 * 解压nodeList压缩
 * @param {String} key 后端返回的流
 * @returns 解压之后的对象
 */
function unzip(key) {
  let charData = key.split("").map(function (x) {
    return x.charCodeAt(0);
  });

  const data = Pako.inflate(charData);
  return Utf8ArrayToStr(data);
}
const instance = axios.create({
  // baseURL: `${process.env.REACT_APP_API}/sdata/rest`,
  baseURL: `${apiContextPath}/sdata/rest`,
  timeout: 60000,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  headers:
    (window.location.search && qs.parse(window.location.search).token) ||
    window.token
      ? { token: qs.parse(window.location.search).token || window.token }
      : {},
});

instance.defaults.headers.post["Content-Type"] = "application/json";

instance.interceptors.response.use(
  (response) => {
    let { data } = response;
    if (response.config.url.indexOf("form/queryById") !== -1 && data?.result) {
      data.result = unzip(data.result);
    }
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    if (data && data.status !== 200 && !(data instanceof Blob)) {
      return Promise.reject(response);
    }
    if (data instanceof Blob) {
      response.data = data;
      return response;
    }

    response.data = data && data.result;
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      return;
    }

    return Promise.reject(error.response);
  }
);

export default instance;
