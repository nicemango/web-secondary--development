// 组件可派发事件
export const events = [
  {
    key: "buttonClick",
    name: "按钮点击",
    payload: [
    ],
  },
  {
    key: "rowClick",
    name: "行点击",
    payload: [
      {
        key: "rowInformation", name: "行信息", dataType: "object"
      }
    ],
  },
  {
    key: "load",
    name: "加载",
    payload: [
      {
        key: "rowInformation", name: "行信息", dataType: "object"
      }
    ],
  },
];

// 组件可接收事件
export const actions = [
  {
    key: "load",
    name: "加载",
  },
];

export default {
  actions,
  events,
};
