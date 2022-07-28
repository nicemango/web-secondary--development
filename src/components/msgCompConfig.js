// 组件可派发事件
export const events = [
  {
    key: "onSelectClick",
    name: "日期发送事件",
    payload: [
      {
        name: "日期",
        key: "date",
        dataType: "array",
      },
    ],
  },
];

// 组件可接收事件
export const actions = [
  {
    key: "messageSuccess",
    name: "成功提示",
  },
];

export default {
  actions,
  events,
};
