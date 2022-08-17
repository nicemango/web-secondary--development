import axios from "axios";
import qs from "querystringify";

// const apiContextPath = "http://192.168.1.240:43214";

const instance = axios.create({
  baseURL: `/sdata/rest`,
  timeout: 60000,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  headers: {
    token:
      "eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2MDY5Nzg4NDA4OSwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.TagdXDjH4QXi4yEXLGPoc301x45817-KPjFAkc6hJ9U",
    Cookie:
      "JSESSIONID=C6F7CF88E364DB3DCA96A37C7E896463; Hm_lvt_926c68ba6ec589b3a07d92a10dca3669=1658717810; lang=zh-cn; XSRF-TOKEN=d09d5258-d553-4114-956c-d9a931f9536a; windowOnline=true; username=admin; authPicKey=67ba286ceaad49a79d6424a9fff2979d; password=sdy_23sZG; token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2MDY5Nzg4NDA4OSwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.TagdXDjH4QXi4yEXLGPoc301x45817-KPjFAkc6hJ9U; refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2MDY5Nzg4NDA5M30.FWzXdOKfEUgFTLD3RsM8MLlRnKy9eCvUP4nyhwas72A",
  },
});

instance.defaults.headers.post["Content-Type"] = "application/json";

instance.interceptors.response.use(
  (response) => {
    let { data } = response;
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
