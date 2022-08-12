import moment from "moment";

// moment.locale('zh-cn');

export function startOfDay(date) {
  date.setHours(0, 0, 0, 0);
  return date;
}

function isToday(dirtyDate) {
  return startOfDay(dirtyDate).getTime() === startOfDay(new Date()).getTime();
}

function isYesterday(dirtyDate) {
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return startOfDay(dirtyDate).getTime() === startOfDay(yesterday).getTime();
}

export const subtract = (date, n, type) => moment(date).subtract(n, type);

export const formatDistanceToNow = (date) => moment(date).fromNow();

export const formatDate = (date) => {
  if (isToday(new Date(date))) {
    return `今天 ${moment(date).format("HH:mm")}`;
  } else if (isYesterday(new Date(date))) {
    return `昨天 ${moment(date).format("HH:mm")}`;
  } else {
    return moment(date).format("YYYY-MM-DD HH:mm");
  }
};
export const formatDataDetail = (date) => {
  if (date) {
    return moment(date).format("YYYY-MM-DD HH:mm");

  }
};
