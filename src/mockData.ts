// 开发环境 数据
const dataSource = [
  ["衬衫", "高跟鞋", "裤子", "袜子", "雪纺衫", "羊毛衫"],
  [5, 10, 10, 17, 36, 20],
];

// 开发环境 配置项
const options = {
  externalVariables: {
    fontSize: "20px",
  },
};

// 开发环境 调取接口所需账号密码
export const account = {
  user: "",
  password: "",
};

export const props = {
  dataSource,
  options,
};
