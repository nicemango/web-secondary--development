<template>
  <div class="tree">
    <!-- 应用右边 -->
    <el-card class="tree_left">
      <div class="tree_button">
        <el-button
          icon="el-icon-plus"
          size="mini"
          class="background: #F5F7FA;"
          @click="append"
          :disabled="addDisabledButton"
          >新增</el-button
        >
        <el-button
          icon="el-icon-edit"
          size="mini"
          :disabled="disabledButton"
          @click="edit"
          >编辑</el-button
        >
        <el-button
          icon="el-icon-delete"
          size="mini"
          :disabled="disabledButton"
          @click="remove"
          >删除</el-button
        >
      </div>
      <div>
        <el-tree
          :data="treeList"
          default-expand-all
          @node-click="handleNodeClick"
          :props="defaultProps"
          :expand-on-click-node="false"
        ></el-tree>
      </div>
    </el-card>
    <!-- 应用右边 -->
    <el-card class="tree_right">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="sample" label="样品位置"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
import { queryAssetById } from './api/asset'

export default {
  name: "App",
  props: {
    customConfig: Object,
    info: Object,
  },
  data() {
    return {
      disabledButton: true,
      addDisabledButton: true,
      treeNode: {},
      treeData: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeList: [],
      tableData: [],
      labelList: [],
    };
  },
  mounted() {
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    this.getTreeData()
  },
  methods: {
    getTreeData() {
      let { assetId } = this.customConfig
      queryAssetById(assetId).then( (res) => {
        if(res.status == 200) {
          const nest = (items, data_id = '') => items.filter(item => item['parent_id'] == data_id).map(item => ({ ...item, children: nest(items, item.data_id) }));

          let treeList = this.translatePlatformDataToJsonArray(res)
          
          this.treeList = nest(treeList)
          
          this.$nextTick(() => {
            this.labelList = [];
            this.createTableData(this.treeList);
            this.refreshTableData();
          });
        }

      })
    },
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
          console.log(item,index)
          temp[tableHeader[index]] = item;
        });
        tableData.push(temp);
      });
      return tableData;
    },
    // 节点选中
    handleNodeClick(node, data) {
      this.treeNode = node;
      this.treeData = data;
      this.disabledButton = true;
      if(node.name == "样品位置") {
        this.disabledButton = true
        this.addDisabledButton = false
      } else {
        this.disabledButton = false
        this.addDisabledButton = false
      }
    },
    // 更新DOM
    updateTreeDom() {
      let element = document.getElementsByClassName("el-tree-node__content");
      for (let i = 0; i < element.length; i++) {
        let stylePadding = window.getComputedStyle(element[i], null);
        let paddingLeft = parseFloat(
          stylePadding.getPropertyValue("padding-left")
        );
        element[i].style.cssText = `margin-left: ${paddingLeft}px !important;`;
      }
    },
    // 创建表格数据
    createTableData(arr, temp = "") {
      if (arr.length) arr = arr[0];
      arr.children.forEach((element) => {
        temp += `${element.name}-`;
        if (element.children.length) {
          this.createTableData(element, temp);
          temp = temp.substring(0, temp.length - (element.name.length + 1));
        } else {
          this.labelList.push(temp);
          temp = temp.substring(0, temp.length - (element.name.length + 1));
        }
      });
    },
    // 刷新表格数据
    refreshTableData() {
      this.tableData = [];
      this.labelList.forEach((item) => {
        this.tableData.push({
          sample: item.slice(0, -1),
        });
      });
    },
    // 新增节点
    append() {
      this.$prompt("请输入节点名称", "新增", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then((e) => {
        this.treeNode.children.push({
          name: e.value || "节点",
          children: [],
        });
        this.$nextTick(() => {
          this.labelList = [];
          this.createTableData(this.treeList);
          this.refreshTableData();
        });
      }).catch(() => {});
    },
    // 修改节点
    edit() {
      this.$prompt("请输入节点名称", "编辑", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then((e) => {
          this.treeNode.name = e.value;
          this.$nextTick(() => {
            this.labelList = [];
            this.createTableData(this.treeList);
            this.refreshTableData();
          });
        })
        .catch(() => {});
    },
    // 删除节点
    remove() {
      this.$confirm("此操作将永久删除该节点, 是否继续?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let childrenNode = this.treeData.parent.data.children;

          for (let i = 0; i < childrenNode.length; i++) {
            if (this.treeNode.name == childrenNode[i].name) {
              childrenNode.splice(i, 1);
            }
          }
          this.$nextTick(() => {
            this.labelList = [];
            this.createTableData(this.treeList);
            this.refreshTableData();
          });
        })
        .catch(() => {});
    },

    triggerEvent() {
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEventNew({
          objectId: appId,
          componentId: componentId,
          type: "app",
          event: "onImgClick",
          payload: {
            value: "sasdasd",
          },
        });
    },
    do_EventCenter_messageSuccess() {
      alert("动作执行成功！");
    },
    Event_Center_getName() {
      return "应用二开测试";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>

<style lang="less">
.tree {
  width: 100%;
  display: flex;
}
.tree_left,
.tree_right {
  width: 50%;
}
.tree_right {
  width: 49%;
  margin-left: 1%;
}
.tree_button {
  width: 100%;
  text-align: right;
  margin-bottom: 20px;
}
.el-tree-node__content {
  background: #f4f4f5;
  border-radius: 4px;
  height: 35px;
  line-height: 35px;
  margin-bottom: 15px;
  border: 1px solid #f4f4f5;
}
// 选中节点效果
.el-tree-node.is-current > .el-tree-node__content {
  border: 1px solid #409eff;
}
// 图标旋转
.el-tree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
// 树形子节点未展开
.el-tree .el-icon-caret-right:before {
  content: "+";
  display: block;
  width: 13px;
  height: 13px;
  font-size: 13px;
  color: #409eff;
  border: 1px solid #409eff;
  text-align: center;
  border-radius: 4px;
}
// 树形子节点展开
.el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  content: "-";
  display: block;
  width: 13px;
  height: 13px;
  font-size: 14px;
  color: #409eff;
  border: 1px solid #409eff;
  text-align: center;
  border-radius: 4px;
}
// 树形子节点最后一级
.el-tree-node__expand-icon.is-leaf::before {
  content: "";
  display: block;
  width: 12px;
  height: 12px;
  border: 1px solid #409eff;
  text-align: center;
  border-radius: 50%;
}
.has-gutter th:first-child {
  padding-top: 0;
}
</style>
