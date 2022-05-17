<template>
  <div class="multiFfilterDataGrid">
    <div class="header">
      <div class="card-title">
        {{ title }}
      </div>
      <div class="total">{{ allTableList.length }}</div>
      <div>
        <el-button type="primary" @click="handleButtonClick">{{
          buttonTitle
        }}</el-button>
      </div>
    </div>
    <div class="inputSearch" v-for="item in inputSearchArr">
      <el-input
        v-model="item.value"
        style="margin-top: 5px"
        @change="load"
      ></el-input>
    </div>
    <div class="select" v-for="(selectList, index) in selectSearchArr">
      <el-select
        style="width: 100%; margin-top: 5px"
        v-model="selectValueArr[index]"
        @change="selectload"
        clearable
      >
        <el-option
          v-for="(item, index) in selectList"
          :key="index"
          :label="item.label"
          :value="item.value"
          >{{ item.label }}
        </el-option>
      </el-select>
    </div>
    <el-table
      :data="displayTableList"
      highlight-current-row
      @row-click="handleRowClick"
    >
      <el-table-column :prop="tableDisplayFieldName"> </el-table-column>
    </el-table>
    <div style="width: 100%" class="pagaNation">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        ccccccc
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
import _ from "lodash";
import { queryAssetById } from "@/api/asset.js";
import { Row } from "element-ui";

export default {
  name: "App",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      title: "",
      buttonTitle: "",
      inputSearchArr: [],
      selectSearchArr: [],
      selectValueArr: [],
      selectList: [],
      selectDisplayFieldName: "",
      selectValueFieldName: "",
      tableDisplayFieldName: "",
      currentPage: 1,
      total: 0,
      pageSize: 10,
      allTableList: [],
      displayTableList: [],
      selectedRowInformation: "",
      inputSelectConfig: {},
      flgObj: {},
      newselectArr: [],
      inputOverList:[]
    };
  },
  computed: {
    filterCondition() {
      let inputValueArr = [];
      this.inputSearchArr.forEach((item) => {
        !_.isEmpty(item?.value) && inputValueArr.push(item.value);
      });
      let selectValueArr = _.cloneDeep(this.selectValueArr).filter((item) => {
        return !_.isEmpty(item);
      });
      return new Set([...inputValueArr]);
    },
    fiterSelectCondition(){
      let selectValueArr = _.cloneDeep(this.selectValueArr).filter((item) => {
        return !_.isEmpty(item);
      });
       return new Set([...selectValueArr]);

    }
  },
  mounted() {
    let {
      title,
      buttonTitle,
      tableDisplayFieldName,
      selectDisplayFieldName,
      selectValueFieldName,
      assetId,
      selectAssetId,
      inputSelectConfig,
    } = this.customConfig;
    this.title = title;
    this.tableDisplayFieldName = tableDisplayFieldName;
    this.buttonTitle = buttonTitle;
    this.selectDisplayFieldName = selectDisplayFieldName;
    this.selectValueFieldName = selectValueFieldName;
    this.inputSelectConfig = inputSelectConfig;
    queryAssetById(assetId).then((originTableData) => {
      this.handleTableData(originTableData);
      this.load();
    });
    queryAssetById(selectAssetId).then((originSelectData) => {
      this.handleSelectData(originSelectData);
      this.load();
    });

    this.renderSelectAndInput();
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
  },
  methods: {
    filterDataBySearchAndSelect() {
      console.log(Array.from(this.filterCondition));
      let result = [];
      if (this.filterCondition.size == 0) {
        result = this.allTableList;
        return result;
      }
      //创建obj对象，保存输入值得对应关系
      let obj = {};
      for (let i = 0; i < Array.from(this.filterCondition).length; i++) {
        for (let j = 0; j < this.inputSelectConfig.input.field.length; j++) {
          obj[this.inputSelectConfig.input.field[i]] = Array.from(
            this.filterCondition
          )[i];
        }
      }
      console.log('obj==',obj);
      //result为对应关系从总数据里多字段筛选出来的数据
      result = this.allTableList.filter((item) => {
        return Object.keys(obj).every(
          (key) => item[key] && item[key].indexOf(obj[key]) > -1
        );
      });
      this.inputOverList = result
      console.log("result", result);

      // result = this.allTableList.filter((tableItem) => {
      //   return Array.from(this.filterCondition).every(
      //     (item) => tableItem[this.tableDisplayFieldName].indexOf(item) > -1
      //   );
      // });
      return result;
    },
    selectload() {
      this.displayTableList = this.inputOverList
      console.log("111==", this.selectValueArr);
      console.log('fiterSelectCondition==',Array.from(this.fiterSelectCondition));
      console.log('displayTableList==',this.displayTableList);
      let obj = {};
      let result = []
      let flagStr = []
      this.inputSelectConfig.select.field.forEach(item=>{
        flagStr.push(item.searchField)
      })
      console.log('flagStr===',flagStr);
      console.log('selectValueArr==',this.selectValueArr);
      console.log('displayTableList',this.displayTableList);
      console.log('this.inputSelectConfig.select.field[0].searchField==',this.inputSelectConfig.select.field[0].searchField);
      console.log('this.fiterSelectCondition[0]',this.fiterSelectCondition);

      result = this.displayTableList.filter(item=>{
        return item[this.inputSelectConfig.select.field[0].searchField] ==Array.from(this.fiterSelectCondition)[0]
      })
      console.log('result',result);
      this.displayTableList = result 
    },
    load() {
      this.displayTableList = this.filterDataBySearchAndSelect();
      this.displayTableList = this.filterDataBypagination(
        this.displayTableList
      );
    },
    handleButtonClick() {
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEvent(componentId, "buttonClick", {});
    },
    renderSelectAndInput() {
      for (let i = 0; i < this.inputSelectConfig.input.inputNum; i++) {
        this.inputSearchArr.push({ value: "" });
      }
      for (let j = 0; j < this.inputSelectConfig.select.selectNum; j++) {
        this.selectSearchArr.push(this.selectList);
      }
      console.log("this.selectSearchArr==", this.selectSearchArr);
    },
    //将平台的数据转化为正常使用的数据形式
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
    handleTableData(originTableData) {
      let tableData = this.translatePlatformDataToJsonArray(originTableData);
      this.allTableList = tableData;
    },
    handleSelectData(originSelectData) {
      let selectData = this.translatePlatformDataToJsonArray(originSelectData);
      console.log("selectData==", selectData);
      let displayMapping;
      try {
        displayMapping = this.inputSelectConfig.select.field;
      } catch (error) {
        console.log("传入的数据不合法")
      }
      selectData.forEach((selectDataItem) => {
        displayMapping.forEach((displayMappingItem)=>{
           this.selectList.push({
          label: selectDataItem[displayMappingItem["showField"]],
          value: selectDataItem[displayMappingItem["searchField"]],
        }); 
        })
        
      });
      console.log("this.selectList==", this.selectList);
    },
    filterDataBypagination(data) {
      this.total = data.length;
      if ((this.currentPage - 1) * this.pageSize >= this.total) {
        this.currentPage =
          Math.ceil(this.total / this.pageSize) == 0
            ? 1
            : Math.ceil(this.total / this.pageSize);
      }
      return data.slice(
        (this.currentPage - 1) * this.pageSize,
        Math.min(this.currentPage * this.pageSize, this.total)
      );
    },
    handleRowClick(row) {
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEvent(componentId, "rowClick", {
          rowInformation: row,
        });
    },
    handleSelectedChange(row) {
      console.log(row);
      row && (this.selectedRowInformation = row[this.tableDisplayFieldName]);
    },
    handleSizeChange() {
      this.load();
    },
    handleCurrentChange() {
      this.load();
    },
    do_EventCenter_load() {
      this.load();
    },
    // do_EventCenter_reset(){
    //
    // },
    Event_Center_getName() {
      return "多重过滤数据表格列表";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
  watch: {},
};
</script>
<style scoped>
.header {
  display: flex;
  justify-content: space-around;
  height: 50px;
  line-height: 50px;
}
.header .card-title {
  font-size: 20px;
  font-weight: bold;
}
.header .total {
  color: #409eff;
}
.multiFfilterDataGrid >>> .el-table__header-wrapper {
  height: 0px;
}
.multiFfilterDataGrid >>> .el-table__row.current-row {
  color: #409eff;
}

.multiFfilterDataGrid >>> .el-table__body tr.current-row > td.el-table__cell {
  background-color: #fff;
}
.multiFfilterDataGrid >>> .el-table {
  max-height: 500px;
  overflow: auto;
}

.multiFfilterDataGrid >>> .el-table .el-table__cell {
  border-bottom: 0;
}
</style>
