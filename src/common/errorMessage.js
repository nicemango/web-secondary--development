import intl from "react-intl-universal";
/*
 * @Author: zhangzhuo
 * @Email: zhangzhuo@njsdata.com
 * @LastEditors: zhangjin
 * @Date: 2020-11-13 09:20:36
 * @LastEditTime: 2022-01-23 22:38:21
 * @Description: 请描述文件作用
 */
import { message as Message } from "antd";
import requestError from "./components/request-error/errorCode";

const ErrorCode = {
  ...requestError,
  10010003: "未选择资产",
  10010004: "您无权访问该填报绑定的资产",
  10019023: intl.get("ERROR.10010004").d("无权限访问"),
  10130000: intl.get("COMM.DSVF"),
  10130001: intl.get("COMM.DBMCE"),
  10130002: intl.get("COMM.TFBBTFCDNEITD"),
  10130003: intl.get("COMM.FKNF"),
  10130004: intl.get("COMM.CFTPKOTABBTRMSCOSTC"),
  10130005: intl.get("COMM.TFBBTFCDNEITD"),
  10130006: intl.get("COMM.TFBBTCII"),
  10130007: "填报id不存在",
  10130008: "视图id不存在",
  10130009: intl.get("REPO.DVF"),
  10130010: intl.get("COMM.UAT"),
  10130011: "导出数据长度超过32767",
  10130012: intl.get("COMM.ANF"),
  10130013: intl.get("COMM.TTOIDDNMTR"),
  // '10130014': '',
  10130015: "更新填报数据时，id不可为空",
  10130016: intl.get("COMM.TAFINTSDS"),
  10130017: "数据不可为null",
  10130018: intl.get("COMM.EIVTOMC"),
  10130021: intl.get("COMM.TVOPSOESTSCBEADNCPSOEST"),
  10130023: intl.get("COMM.TFCFCBQ"),
  10130024: intl.get("COMM.TFTINWTTL"),
  10130025: intl.get("COMM.CCMBBTAOTSO"),
  20130000: intl.get("COMM.FTQKC"),
  20130001: intl.get("COMM.KMQGPQPE"),
  20130002: intl.get("COMM.KMFTQTGF"),
  20130003: intl.get("COMM.FTQCMGP"),
  10130026: intl.get("COMM.DTCBE"),
  10130027: intl.get("COMM.NATD"),
  10130032: intl.get("COMM.IMCBC"),
  10130045: "存储字段的值唯一时必须使用关系型数据库，且必须和主表资产同源",
  10130049: intl.get("COMM.PUWTSOESTTSVAADFTCFA"),
  10130042: "时间格式不正确",

  // license{intl.get('COMM.ERROR_CHECK')}
  100000008: "错误的lic文件",
  100000009: intl.get("COMM.MILE"),
  100000010: intl.get("COMM.NO_ACCESS"),
  100000011: intl.get("ERROR.100000011"),
  100000012: "mac地址错误",
  100000013: "错误的lic类型",
  100000007: "saas模式不支持更新license,请联系管理员",
  10130030: "应用配置有误，请联系应用配置人员处理",
  10130035: intl.get("COMM.TDCIIWTFC"),
  10130036: intl.get("COMM.TSTSCAFIE"),
  10130038: "",
  10130039: "错误的数据id",
  10130040: intl.get("COMM.TABBTDOATMTAANOTSO"),
  // intl.get('COMM.AEP')
  10130043: intl.get("COMM.FGBBFCBEIFD"),

  // /flow/instance/apply
  // /flow/instance/handleAndModify
  // /flow/instance/handle4Form
  10140011: intl.get("COMM.IDNEF"),
  10140012: intl.get("COMM.UDNEF"),
  10140013: intl.get("COMM.BUNEF"),
  10140014: intl.get("COMM.BINEF"),
  10140015: intl.get("COMM.FBNEF"),
  10140016: intl.get("COMM.FTAVN"),
  10140017: intl.get("COMM.FTUVN"),
  10140018: intl.get("COMM.FTDDN"),
  10140019: intl.get("COMM.DSNEF"),
  10140020: intl.get("COMM.SNEF"),
  10140021: intl.get("COMM.QDNEF"),
  10140022: intl.get("COMM.BQNEF"),
  10140023: "restful节点执行失败",
  10140024: intl.get("COMM.FTEISMN"),
  10140025: intl.get("COMM.SNEF"),
  10140026: intl.get("COMM.MNEF"),
  10140027: intl.get("COMM.TDFNEF"),
  10140028: intl.get("COMM.FTTBFNE"),
  10140029: intl.get("COMM.NET"),
  10140030: intl.get("COMM.BIDNE"),
  10140033: "rest接口可以调通，但接口内部返回错误",
  10140058: intl.get("EVEN.TUBL_INTCLVOTHBF"),

  10140006: intl.get("EVEN.PROCESS_DEACTIVATED"),

  100000018: intl.get("COMM.TAIC"),
  10020004: intl.get("COMM.TDSDNE"),

  10160001: intl.get("COMM.PDC"),
  10010014: intl.get("ANAL.AQF"),
  10010015: intl.get("COMM.PARAMETER_ERROR"),
  10010016: intl
    .get("COMM.TMOANFWMT2")
    .d("此模块只分析数值型字段数超过2的资产"),
  100000022: intl.get("HOME.INSUFFICIENT_PERMISSIONS"),
  10130047: intl.get("ERROR.10130047"),
  10130098: intl.get("ERROR.10130098"),
  10130099: intl.get("ERROR.10130099"),
  10130048: intl.get("COMM.GDCBE"),
  10130050: intl.get("COMM.TCILETLOTBFCTTD"),
  10130051: intl.get("COMM.PCWTACOTTVITF"),
  10130091: intl.get("COMM.WMBJZCDGSWJ_EMBJZCXWJ"),
  10130092: intl.get("COMM.YXMBWJYZSBHYGBL"),
  10130088: "存在重复数据，无法提交 ",
  10130089: "此ip已填写过此问卷，无法重复提交",
  10130093: intl.get("COMM.FTEF").d("导出文件失败"),
  10130094: intl.get("COMM.FTEWD").d("导出错误数据失败"),
  10130095: intl
    .get("COMM.BDZC")
    .d("请确认该填报中数据类型选择资产类型的组件是否已正确绑定资产"),
  10210000: intl.get("COMM.YXMBWJYZSBHYGBL").d("名称重复"),
  10210001: intl.get("COMM.YXMBWJYZSBHYGBL").d("编号重复"),
  10210002: intl.get("COMM.YXMBWJYZSBHYGBL").d("数据标准被资产引用"),
  10210003: intl.get("COMM.YXMBWJYZSBHYGBL").d("稽核成功"),
  10210004: intl.get("COMM.YXMBWJYZSBHYGBL").d("稽核失败"),
  10210005: intl.get("COMM.YXMBWJYZSBHYGBL").d("稽核结果不存在"),
  10210006: intl.get("APP.EXPORT_FAILED").d("导出失败"),
  10210007: intl.get("COMM.YXMBWJYZSBHYGBL").d("数据文件不存在"),
  10210008: intl.get("APP.EXPORT_FAILED").d("导出失败"),
  10210009: intl.get("COMM.YXMBWJYZSBHYGBL").d("生成编码成功"),
  10210010: intl.get("COM.JHRWZZJHZ").d("稽核任务正在稽核中"),
  10210011: intl.get("COM.JHRWQDCG").d("稽核任务启动成功"),
  10019022: intl.get("ASS.SJYBYYWFSC").d("数据源被引用，无法被删除"),
  10010017: intl
    .get("ERROR.10010017")
    .d("该资产已被数据填报的多选框锁定，不能删除"),
  10010020: intl.get("ERROR.10010020").d("该资产已被数据填报锁定，不能删除"),
  10019024: intl.get("ERROR.10019024").d("字段存在非法字符"),
  10000024: intl.get("ERROR.10000024"),
  10010007: intl.get("ERROR.10010007").d("cloud table资产文件找不到"),
  10019025: intl.get("ERROR.10019025").d("标准名称或编号重复"),
  10180052: intl.get("ERROR.10180052").d("保存失败"),
  10000229: intl.get("ERROR.10000229").d("插入记录重复"),
};

const checkReason = {
  1: intl.get("REPO.REQUIRED_VERIFICATION"),
  2: intl.get("COMM.UNIQUE_VERIFICATION"),
  3: intl.get("BLOO.DATA_STANDARD"),
  4: intl.get("COMM.REGULAR_CHECK"),
  5: intl.get("COMM.METHOD_VERIFICATION"),
  6: intl.get("COMM.DATE_VERIFICATION"),
  7: intl.get("REPO.CHECK"),
  8: intl.get("COMM.MDV"),
  9: intl.get("COMM.TYPE_CHECK"),
};

export const ErrorMessage = (errorInfo) => {
  const {
    error: { data: { code, result, message } = {}, status } = {},
    messages,
    errorTime = 2,
  } = errorInfo || {};
  // errorTime = errorTime || 2;
  let errMeaage;
  let needClose = false;
  if (status === 404) {
    errMeaage = intl.get("ERROR.404").d("请求接口地址不存在");
  } else if (code) {
    let errMessageList = [];
    if (code === 10130009) {
      result.map((item) => {
        if (Array.isArray(item.errorMessage) && item.errorMessage.length) {
          // {intl.get('COMM.DVPSISTSAT')}
          let msg = "";
          try {
            msg = item.errorMessage[0] && JSON.parse(item.errorMessage[0]);
          } catch (e) {
            console.log(e);
          }
          msg = msg?.content.replace("<p>", "").replace("</p>", "");
          errMeaage = msg;
        } else {
          // {intl.get('COMM.TCHPTEM')}，所以不在message里面报错
          let tempList = result.filter((item) => {
            return item.reason !== "3";
          });
          if (tempList.length === 1 && tempList[0]["reason"] === "2") {
            errMeaage =
              tempList[0]["noPassColNames"][0] + intl.get("COMM.REPEAT");
          } else {
            let itemMeaasge =
              item["noPassColNames"][0] +
              intl.get("COMM.DISSATISFACTION") +
              checkReason[item.reason];
            errMessageList.push(itemMeaasge);

            errMeaage = errMessageList.join(";");
          }
        }
      });
      // errMeaage = errMessageList.join(',') + intl.get('REPO.DVF');
    } else if (code === 100000018) {
      // result.map((item, index) => {
      //   errMessageList.push(item.col_name);
      //   errMeaage = errMessageList.join(',') + intl.get('COMM.TAIC');
      // });
      errMeaage = `${intl.get("COMM.ICICN")}.,;{}()\n\t=/${intl.get(
        "COMM.TCNC"
      )}`;
    } else if (code === 10130038) {
      errMeaage = result.join(",") + intl.get("COMM.DOCE");
    } else if (code === 10130006) {
      const errValue = Array.isArray(result)
        ? result.join(",")
        : intl.get("APP.ASSEMBLY");
      errMeaage = `【 code:${code} 】${errValue}${intl.get("COMM.TBFII")} `;
    } else if (code === 10130051) {
      errMeaage = `【 code:${code} 】${intl.get(
        "COMM.PCWTACOTTVITF"
      )}${result}`;
    } else {
      errMeaage = `[ code:${code} ] ${ErrorCode[code]}`;
      if (code >= 10140011 && code <= 10140029) needClose = true;
    }
  } else if (messages) {
    errMeaage = messages;
  } else if (message) {
    errMeaage = message;
  } else {
    errMeaage = intl.get("COMM.OPERATION_ERROR").d("操作出错");
  }
  Message.error(errMeaage, errorTime);
  // intl.get('COMM.ECP')
  needClose &&
    setTimeout(() => {
      window.close();
    }, errorTime * 1000);
};
