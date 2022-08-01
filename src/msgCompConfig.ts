// 组件可派发事件
export const events: IEvent[] = [
  {
    key: "onClick",
    name: "点击",
    payload: [
      {
        name: "名称",
        key: "name",
        dataType: "string",
      },
    ],
  },
];

// 组件可接收事件
export const actions: IAction[] = [
  {
    key: "messageSuccess",
    name: "成功提示",
    params: [
      {
        key: "value",
        name: "值",
        dataType: "string",
      },
    ],
  },
];

export default {
  actions,
  events,
};
