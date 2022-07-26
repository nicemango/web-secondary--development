<template>
  <div class="gantt_all">
    <div class="ganttLoading" v-if="!taskList[0]"></div>
    <!-- 左侧 -->
    <div id="gantt_left" class="gantt_left">
      <div class="list_lattice_first" v-if="projectList[0] || taskList[0]"></div>
      <div v-for="(item, index) in projectList" :key="index">
        <div class="list_lattice">{{ item.label }}</div>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="gantt_right">
      <!-- 时间轴 -->
      <div class="gantt_header">
        <div v-for="(item, index) in taskList" :key="index">
          <div class="header_lattice" :style="isToday(item)">{{ item }}</div>
        </div>
      </div>
      <!-- 任务轴 -->
      <div class="gantt_task" v-for="(item, index) in projectList" :key="index">
        <div :id="`${item.id}_${item2}`" class="task_lattice" v-for="(item2, index2) in taskList" :key="index2"></div></div>
    </div>
  </div>
</template>

<script>
// 引入接口
import { queryAssetById, delectData } from "../api/asset";

import $ from "jquery";
window.$ = $;

import qs from 'querystringify'

export default {
  name: "List",

  props: {
    platformProps: Object,
    customConfig: Object,
  },

  data() {
    return {
      // 保存配置项信息
      configForm: {},
      // 处理后项目数据
      projectList: [],
      // 处理后任务数据
      taskList: [],
      // 任务类型
      taskType: "",
      // 加载等待
      ganttLoading: false,

      projectNameData: [
        [
            {
                "label": "项目名称",
                "columnId": "6161c2a2-5af8-4673-b219-f2769dd1589e",
                "value": {
                    "value": "项目一",
                    "display": "项目一"
                },
                "showType": "select"
            },
            {
                "label": "id",
                "columnId": "a4fe850d-87bc-4d88-b611-eda80b21dc6b",
                "value": {
                    "value": "111",
                    "display": "111"
                },
                "showType": "input"
            }
        ],
        [
            {
                "label": "项目名称",
                "columnId": "6161c2a2-5af8-4673-b219-f2769dd1589e",
                "value": {
                    "value": "项目一",
                    "display": "项目一"
                },
                "showType": "select"
            },
            {
                "label": "id",
                "columnId": "a4fe850d-87bc-4d88-b611-eda80b21dc6b",
                "value": {
                    "value": "222",
                    "display": "222"
                },
                "showType": "input"
            }
        ],
        [
            {
                "label": "项目名称",
                "columnId": "6161c2a2-5af8-4673-b219-f2769dd1589e",
                "value": {
                    "value": "项目二",
                    "display": "项目二"
                },
                "showType": "select"
            },
            {
                "label": "id",
                "columnId": "a4fe850d-87bc-4d88-b611-eda80b21dc6b",
                "value": {
                    "value": "333",
                    "display": "333"
                },
                "showType": "input"
            }
        ],
        [
            {
                "label": "项目名称",
                "columnId": "6161c2a2-5af8-4673-b219-f2769dd1589e",
                "value": {
                    "value": "项目三",
                    "display": "项目三"
                },
                "showType": "select"
            },
            {
                "label": "id",
                "columnId": "a4fe850d-87bc-4d88-b611-eda80b21dc6b",
                "value": {
                    "value": "444",
                    "display": "444"
                },
                "showType": "input"
            }
        ]
      ]    
    };
  },

  watch: {
    "platformProps.data": {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        console.log('触发监听', this.platformProps)
        this.configForm = this.platformProps.pluginConfig;
        // 加载项目数据
        this.getProjectListData()
      },
    }
  },

  mounted() {
    document.body.addEventListener("click", () => {
      if ($("dropdown")) {
        $("#dropdown").remove();
      }
    });
    
    // 配置项信息
    if (this.platformProps) {
      this.configForm = this.platformProps.pluginConfig;
    } else {
      this.configForm = this.customConfig.configuration;
    }
    // 获取甘特图显示状态
    this.taskType = this.configForm.timeStep || 'date';
  },

  methods: {
    // 数据转换
    translatePlatformDataToJsonArray(originTableData) {
      let originTableHeader = originTableData.data[0];
      let tableHeader = [];
      originTableHeader.forEach((item) => {
        tableHeader.push(item.col_name);
      });
      let tableBody = originTableData.data[1];
      let tableData = [];
      tableBody.forEach((tableItem) => {
        let temp = {};
        tableItem.forEach((item, index) => {
          temp[tableHeader[index]] = item;
        });
        tableData.push(temp);
      });
      return tableData;
    },

    // 处理时间
    handleTime(resData) {
      // 保存处理后的返回数据
      let taskData = {
        ...resData
      };
      // 保存宽度
      let px = "";
      // 提取时间
      let startDateYear = new Date(resData.startTime).getFullYear();
      let startDateMonth = new Date(resData.startTime).getMonth() + 1;
      let startDateDay = new Date(resData.startTime).getDate();
      let startDateHours = new Date(resData.startTime).getHours();
      let endDateHours = new Date(resData.endTime).getHours();
      let startDateMinutes = new Date(resData.startTime).getMinutes();
      // 计算每个月多少天
      let monthDay = new Date(startDateYear, startDateMonth, 0).getDate();
      // 根据任务类型处理返回数据
      if (this.taskType == "month") {
        // 算出每月占格像素
        px = (140 / monthDay);
        // 算出相差天数
        let days = parseInt(
          (new Date(resData.endTime).getTime() - new Date(resData.startTime).getTime()) / (1000 * 60 * 60 * 24)
        );
        // 赋值
        taskData.taskTime = `${startDateYear}年${startDateMonth}月`;
        taskData.marginLeft = Math.abs(startDateDay * px);
        taskData.width = Number((days * px).toFixed(1));
      } else if (this.taskType == "date") {
        // 算出每日占格像素
        px = (140 / 24);
        // 算出相差小时
        let days = parseInt(
          (new Date(resData.endTime).getTime() - new Date(resData.startTime).getTime()) / (1000 * 60 * 60)
        );
        // 赋值
        taskData.taskTime = `${startDateYear}年${startDateMonth}月${startDateDay}日`;
        taskData.marginLeft = Math.abs(startDateHours * px);
        taskData.width = Number((days * px).toFixed(1)) + 6;
      } else if (this.taskType == "time") {
        px = (140 / 60);
        // 算出相差分钟
        let days = (new Date(resData.endTime).getTime() - new Date(resData.startTime).getTime()) / (1000 * 60);
        // 计算相差天数的零点点数
        let differZero = Number( (days/60/24).toFixed(0) )
        // 如果开始时间为零点，则相差天数减一
        if(startDateHours < 1) differZero--
        
        // 如果结束时间为零点，则相差天数加一
        if(endDateHours < 1) differZero++
        
        // 赋值
        taskData.taskTime = `${startDateYear}年${startDateMonth}月${startDateDay}日${startDateHours}时`;
        taskData.marginLeft = Math.abs(startDateMinutes * px);
        taskData.width = Number(days * px) + (differZero * 140) + 2;
      }
      // 赋值
      taskData.belongProject = resData[this.configForm.taskMappingField];
      taskData.taskName = this.getField(this.configForm.taskField, resData);

      return taskData;
    },

    // 获取字段
    getField(templateStr, data) {
      return templateStr.replace(/\{\{(\w+)\}\}/g, function (findStr, $1) {
        return data[$1] || ''
      });
    },

    // 获取项目列数据
    getProjectListData() {

      // 保存处理后的项目列数据
      let dataArray = []
      // 处理项目表数据
      // this.projectNameData.forEach( (item, index) => {
      this.platformProps.data.forEach( (item, index) => {
        let dataObj = {}
        // 去除默认字段
        if(item.length > 9) item.splice(-9, 9)
        // 过滤数据
        item.forEach( (e, i) => {
          switch (e.label) {
            case "id":
              dataObj.id = e.value.display || ''; break;
            case "项目名称":
              dataObj.label = e.value.display || ''; break;
          }
        })
        dataArray.push(dataObj)
      })
      // 项目列赋值

      console.log(dataArray)
      this.projectList = [...new Set(dataArray)]

      this.getTaskListData()
    },

    // 获取任务列数据
    getTaskListData() {
      // 请求任务资产
      queryAssetById(this.configForm.taskID).then((res) => {
        let resData = this.translatePlatformDataToJsonArray(res);
          this.handleData(resData);
      });
    },

    // 生成任务数据
    handleData(taskDataList) {
      // 储存开始时间
      let _dataStart = [];
      // 储存结束时间
      let _dataEnd = [];
      // 储存DOM数据
      let _dataList = [];
      // 重置数据
      taskDataList.forEach((e, i) => {
        _dataStart.push(Date.parse(new Date(e.startTime)));
        _dataEnd.push(Date.parse(new Date(e.endTime)));
        let obj = this.handleTime(e);
        _dataList.push(obj);
      });
      // 正序排列开始时间和结束时间
      _dataStart.sort((a, b) => {
        return a - b;
      });
      _dataEnd.sort((a, b) => {
        return a - b;
      });
      // 生成最早时间和最晚时间
      let startYear = new Date(_dataStart[0]).getFullYear();
      let startMonth = new Date(_dataStart[0]).getMonth() + 1;
      let startDate = new Date(_dataStart[0]).getDate();
      let startHours = new Date(_dataStart[0]).getHours();
      let endYear = new Date(_dataEnd[_dataEnd.length - 1]).getFullYear();
      let endMonth = new Date(_dataEnd[_dataEnd.length - 1]).getMonth() + 1;
      // 保存相差时间
      let _dateTime = "";
      // 初始化字符串时间
      let strYear = startYear;
      let strMonth = startMonth;
      let strDate = startDate;
      let strHours = startHours;
      // 计算出总相差时间
      if (this.taskType == "month") {
        // 计算相差月份
        if (endYear - startYear >= 2) {
          _dateTime = 12 - startMonth + endMonth + (endYear - startYear - 1) * 12;
        } else if (endYear - startYear == 1) {
          _dateTime = 12 - startMonth + endMonth;
        } else {
          _dateTime = endMonth - startMonth;
        }
        // 根据相差时间生成对应年月
        for (let i = 0; i < _dateTime + 2; i++) {
          if (strMonth > 12) {
            strYear++;
            strMonth = 1;
          }
          this.taskList.push(`${strYear}年${strMonth}月`);
          strMonth++;
        }
        this.$nextTick( () => {
          setTimeout(() => {
            this.creatDom(_dataList)
          },100)
        })
      } else if (this.taskType == "date") {
        // 计算相差天数
        _dateTime = parseInt(
          new Date(
            new Date(_dataEnd[_dataEnd.length - 1]).getTime() - _dataStart[0]
          ).getTime() /
            (1000 * 60 * 60 * 24)
        );
        // 根据相差时间生成对应年月日
        for (let i = 0; i < _dateTime + 2; i++) {
          if (strDate > new Date(strYear, strMonth, 0).getDate()) {
            strMonth++;
            strDate = 1;
            if (strMonth > 12) {
              strYear++;
              strMonth = 1;
            }
          }
          this.taskList.push(`${strYear}年${strMonth}月${strDate}日`);
          strDate++;
        }
        this.$nextTick( () => {
          setTimeout(() => {
            this.creatDom(_dataList)
          },100)
        })
      } else if (this.taskType == "time") {
        // 计算相差天数
        let days = parseInt(
            new Date(
              new Date(_dataEnd[_dataEnd.length - 1]).getTime() - _dataStart[0]
            ).getTime() /
              (1000 * 60 * 60 * 24)
          ) + 1;
        // 计算相差小时数
        _dateTime = parseInt(
          new Date(
            new Date(_dataEnd[_dataEnd.length - 1]).getTime() - _dataStart[0]
          ).getTime() /
            (1000 * 60 * 60)
        );
        // 根据相差时间生成对应年月日时
        for (let i = 0; i < _dateTime + days + 2; i++) {
          if (strHours > 24) {
            strDate++;
            strHours = 0;
            if (strDate > new Date(strYear, strMonth, 0).getDate()) {
              strMonth++;
              strDate = 1;
              if (strMonth > 12) {
                strYear++;
                strDate = 1;
              }
            }
          }
          this.taskList.push(
            `${strYear}年${strMonth}月${strDate}日${strHours}时`
          );
          strHours++;
        }
        this.$nextTick( () => {
          setTimeout(() => {
            this.creatDom(_dataList)
          },100)
        })
      }
    },

    // 生成DOM
    creatDom(dataList) {
      // 移除下拉菜单元素
      if ($("#dropdown")) $("#dropdown").remove();
      // 生成任务元素
      dataList.forEach((e, i) => {
        // 获取DomID
        let listDom = $(`#${e.belongProject}_${e.taskTime}`);
        // 生成下拉菜单ID
        let dropID = `${e.belongProject}_${i}`
        // 生成任务DOM
        let taskDiv = `
          <div id="${dropID}" class="task_div" style="margin-left: ${e.marginLeft}px; width: ${e.width}px">
            <div class="task_title">${e.taskName}</div>
          </div>
        `
        // 添加任务DOM元素
        listDom.append(taskDiv);
        // 生成下拉菜单
        $(`#${dropID}`).on("click", (element) => {
          // 阻止冒泡
          element.stopPropagation()
          // 移除下拉菜单元素
          if ($("#dropdown")) $("#dropdown").remove();
          // 获取项目列边距
          let leftDiv = $('#gantt_left').offset().left + 140
          // 获取当前任务时间轴边距
          let marginDiv = $(`#${e.belongProject}_${e.taskTime}`).offset().left
          // 下拉框出现位置
          let dropLeftDiv = marginDiv + e.marginLeft < leftDiv ? leftDiv : marginDiv + e.marginLeft
          
          // 添加下拉菜单DOM
          let selectDiv = `
            <div class="task_tooltip" style="top: ${listDom.offset().top + 45}px; left: ${dropLeftDiv}px;">${e.taskName}</div>
            <div id="dropdown" class="dropdown" style="top: ${listDom.offset().top + 42}px; left: ${dropLeftDiv}px;">
              <div id="taskDetails" class="dropdown_label">详情</div>
              <div id="taskEdit" class="dropdown_label">编辑</div>
              <div id="taskDelete" class="dropdown_label">删除</div>
            </div>
          `
          $('body').append(selectDiv);

          $('#taskDetails').on('click',() => {
            this.routerHistry(e, 'details')
          })
          $('#taskEdit').on('click',() => {
            this.routerHistry(e, 'insert')
          })
          $('#taskDelete').on('click',() => {
            let dataForm = {
              "where": {
                "and": [
                  {
                    "id": `eq#${e.id}`
                  }
                ]
              }
            }
            delectData(this.configForm.deleteKey, dataForm).then( (res) => {
              $(`#${dropID}`).remove()
            })
          })
        });
      });

      this.ganttLoading = false
    },

    // 跳转数据
    routerHistry(dataList, pathType) {

      function filterSearchParams() {
        const search = qs.parse(location.search);
        const required = ['appid', 'menuId', 'type', 'otherappid', 'pId'];

        return Object.fromEntries(
          Object.entries(search).filter(
            ([k, v]) => required.includes(k) && v !== 'undefined'
          )
        );
      };

      const search = filterSearchParams();
      search.breadcrumb = dataList.taskName;
      search.id = this.configForm.formID;
      search.dataId = dataList.id;

      for(let i in search) {
        if(search[i] === undefined) {
          delete search[i]
        }
      }

      let pathname = ''

      if(pathType == 'details') {
        pathname = `/applicationview/content/detail/view` 
      } else if(pathType == 'insert') {
        pathname = `/applicationview/content/data-form/${this.configForm.formID}/insert` 
      }

      this.platformProps.history.push({
        pathname: pathname,
        search: qs.stringify(search),
      })
    },

    // 今日标题高亮
    isToday(days) {
      let year = new Date().getFullYear()
      let month = new Date().getMonth() + 1
      let day = new Date().getDate()
      let hours = new Date().getHours()

      if(this.taskType == 'month') {
        if(days == `${year}年${month}月`) return 'background: #FFE699;'
      } else if(this.taskType == 'date') {
        if(days == `${year}年${month}月${day}日`) return 'background: #FFE699;'
      } else if(this.taskType == 'time') {
        if(days == `${year}年${month}月${day}日${hours}时`) return 'background: #FFE699;'
      }
    }
  },
};
</script>

<style>
.gantt_all {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  overflow-x: auto;
}
.ganttLoading {
  width: 100%;
  height: 300px;
  z-index: -100;
  background: #ffffff;
}
.gantt_left {
  position: absolute;
  z-index: 111;
  box-sizing: border-box;
}
.list_lattice_first, .list_lattice, .header_lattice {
  width: 140px;
  height: 45px;
  line-height: 45px;
  border: 1px solid #4e4e4e;
}
.list_lattice_first {
  background: #ffffff;
  box-sizing: border-box;
}
.list_lattice {
  border-top: none;
  text-align: center;
  background: #ffffff;
  box-sizing: border-box;
}
.gantt_header, .gantt_task {
  display: flex;
  box-sizing: border-box;
}
.header_lattice {
  border-left: none;
  font-size: 14px;
  box-sizing: border-box;
  text-align: center;
  background: #ffffff;
}
.gantt_right {
  margin-left: 140px;
  box-sizing: border-box;
}
.task_lattice {
  width: 140px;
  height: 45px;
  line-height: 45px;
  border: 1px solid #999;
  border-top: none;
  border-left: none;
  position: relative;
  box-sizing: border-box;
  background: #ffffff;
}
.task_div {
  position: absolute;
  height: 38px;
  background: #ffde5c;
  border-radius: 5px;
  display: flex;
  align-items: center;
  border: 1px solid #4e4e4e;
  text-align: left;
  cursor: pointer;
  z-index: 99;
  margin-top: 3px;
  box-sizing: border-box;
}
.task_div:hover .task_tooltip{
  display: block;
}
.task_tooltip {
  display: none;
  z-index: 199;
}
.task_title {
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
  margin-left: 10px;
}
.dropdown {
  position: absolute;
  min-width: 150px;
  max-width: 150px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  z-index: 199;
}
.dropdown_label {
  height: 30px;
  line-height: 30px;
  background: #fff;
  border-top: none;
  padding-left: 10px;
  cursor: pointer;
  font-size: 13px;
  z-index: 199;
}
.dropdown_label:hover {
  background: #ecf5ff;
  color: #66b1ff;
}
</style>