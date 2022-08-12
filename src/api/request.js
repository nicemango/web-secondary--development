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
      "eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY2MDI2NzEwNDA5NiwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.34YOLsG6QMXLQjPFLokijRZuJu9bbbnuY1z2XLQCz-s",
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
