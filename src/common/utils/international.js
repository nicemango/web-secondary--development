import intl from "react-intl-universal";

// 获取后端传入的动态key
export const intlGetKey = (key) => {
  const regex = new RegExp("(.[\u4E00-\u9FA5]+)|([\u4E00-\u9FA5]+.)", "g");
  if (regex.test(key)) {
    return key;
  }
  if (typeof key === "number") {
    key = key.toString();
  }
  if (!key) return;
  return intl.get(key || "common.empty").d(key);
};

// 获取当前的语言状态
export const getLanguage = () => {
  return localStorage.getItem("lang_type");
};

// 判断当前是不是中文环境
export const isChinese = getLanguage() === "zh-cn";
