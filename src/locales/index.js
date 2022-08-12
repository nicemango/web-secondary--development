import intl from "react-intl-universal";
import moment from "moment";

const localStorageLocaleKey = "lang_type";
const LANG_EN = "en-us";
const LANG_ZH = "zh-cn";

// 语言文件
const zh = require.context("./zh", false, /.json/);

const MOMENT_MAP = {
  "en-us": "en",
  "zh-cn": "zh-cn",
};

let cn_data = {};
zh.keys().forEach((key) => {
  Object.assign(cn_data, zh(key));
});

const locales = {
  "en-us": {},
  "zh-cn": Object.assign({}, window.customZHIntl, cn_data),
};

// 获取语言（先找缓存再找浏览器内置语言）
const getLanguage = () => {
  const language = intl.determineLocale({ localStorageLocaleKey });
  if (language.toLowerCase().startsWith("zh")) {
    return LANG_ZH;
  } else {
    return LANG_EN;
  }
};

export const lang_type = getLanguage();

export const setLang = () => {
  intl.init({
    currentLocale: lang_type,
    locales,
  });
};
moment.locale(MOMENT_MAP[lang_type]);

setLang();
