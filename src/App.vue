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
                                                             }}
        </el-button>
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
        clearable
        @change="load"
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
      <el-table-column :prop="tableDisplayFieldName"></el-table-column>
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
import {queryAssetById} from "@/api/asset.js";

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
      selectFilterCondition: [],
      inputFilterCondition: []
    };
  },
  computed: {
    allFilterCondition() {
      let selectFilterCondition = []
      this.inputSelectConfig.select.forEach((item, index) => {
        let selectFilterConditionItem = {}
        selectFilterConditionItem[item.displayField] = this.selectValueArr[index]
        selectFilterCondition.push(selectFilterConditionItem)
      })
      let inputFilterCondition = []
      this.inputSelectConfig.input.forEach((item, index) => {
        let inputFilterConditionItem = {}
        inputFilterConditionItem[item] = this.inputSearchArr[index].value
        inputFilterCondition.push(inputFilterConditionItem)
      })
      return [...inputFilterCondition, ...selectFilterCondition]
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
    for (let i = 0; i < this.inputSelectConfig.input.length; i++) {
      this.inputSearchArr.push({value: ""});
    }

    let {componentId} = this.customConfig || {};
    componentId &&
    window.componentCenter?.register(
      componentId,
      "comp",
      this,
      eventActionDefine
    );
  },
  methods: {
    filterDataBySearchAndSelect(allTableList) {
      let result = [];
      //result为对应关系从总数据里多字段筛选出来的数据
      result = allTableList.filter((item) => {
        return this.allFilterCondition.every((filterCondition) => {
          let filterConditionKey = Object.keys(filterCondition)[0]
          let filterConditionValue = filterCondition[filterConditionKey] || ""
          return item[filterConditionKey].indexOf(filterConditionValue) > -1
        });
      });

      return result;
    },
    load() {
      this.displayTableList = this.filterDataBySearchAndSelect(this.allTableList);
      this.displayTableList = this.filterDataBypagination(
        this.displayTableList
      );
    },
    handleButtonClick() {
      let {componentId, appId} = this.customConfig || {};
      componentId &&
      appId &&
      window.eventCenter?.triggerEvent(componentId, "buttonClick", {});
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
      let displayMapping;
      try {
        displayMapping = this.inputSelectConfig.select;
      } catch (error) {
        console.log("传入的数据不合法")
      }
      displayMapping.forEach((displayMappingItem) => {
        let selectList = []
        selectData.forEach((selectDataItem) => {
          selectList.push({
            label: selectDataItem[displayMappingItem["displayField"]],
            value: selectDataItem[displayMappingItem["valueField"]],
          });
        })
        this.selectSearchArr.push(selectList)
      });
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
      let {componentId, appId} = this.customConfig || {};
      componentId &&
      appId &&
      window.eventCenter?.triggerEvent(componentId, "rowClick", {
        rowInformation: row,
      });
    },
    handleSelectedChange(row) {
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
