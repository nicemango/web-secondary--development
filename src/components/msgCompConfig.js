// 组件可派发事件
export const events = [];

// 组件可接收事件
export const actions = [
  {
    key: "screenData",
    name: "筛选",
    isSupportChild: false,
    params: [
      {
        name: "筛选",
        key: "screen",
        dataType: "object",
      },
    ],
  },
];

export default {
  actions,
  events,
};
