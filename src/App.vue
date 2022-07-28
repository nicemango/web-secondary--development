<template>
  <div class="nanShan_tree">
    <!-- icon-class="el-icon-arrow-right"  v-if="nsTreeShow" :default-expanded-keys="[expandedKey]"-->
    <el-tree default-expand-all ref="nsTree" node-key="data_id" :data="treeData" :props="defaultProps"
      :highlight-current="true" :render-content="renderContent" :current-node-key="expandedKey"
      @node-click="handleNodeClick"></el-tree>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import { getAssetById } from "./api/asset";
import "./index.css";
export default {
  name: "App",
  props: {
    customConfig: Object,
    sysVariables: Array,
  },
  data() {
    return {
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      expandedKey: "",
      nsTreeShow: true,
      treeData: [],
      oneData: [],
      twoData: [],
      threeData: [],
      fourData: [],
      fiveData: [],
      selectItem: {},
      tempData: [],
      office_id: ''
    }
  },
  computed: {},
  mounted() {
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );

    const office_id = this.sysVariables.filter(x => {
      return x.name == 'current_office_id'
    })
    // console.log(office_id, '=======自定义变量');
    this.office_id = office_id[0].default_value
    // this.office_id = 'nanshan1-1'
    this.getData(); // 一级
    // console.log('customConfig====================>', this.customConfig);
    // console.log('treeData====================>', this.treeData);

  },
  methods: {
    handleNodeClick(data) {
      if (!data.child) return
      console.log(data);
      this.expandedKey = data.data_id;
      let { data_id, name, parent_id, listId } = data;
      this.selectItem = { data_id, name, parent_id, listId };
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEventNew({
          objectId: appId,
          componentId: componentId,
          type: "app",
          event: "treeNodeClick",
          payload: {
            dataId: this.selectItem.data_id,
            name: this.selectItem.name,
            parentId: this.selectItem.parent_id,
            listId: this.selectItem.listId,
          },
        });



    },
    treeSeekId(parentArr, id) {
      if (parentArr.child && parentArr.child.length != 0) {
        for (let i = 0; i < parentArr.child.length; i++) {
          if (parentArr.child[i].data_id == id) {
            this.tempData.push(parentArr.child[i])
            this.treeSeekId(this.treeData[0], parentArr.child[i].parent_id)
            return
          } else {
            this.treeSeekId(parentArr.child[i], id)
          }
        }
      } else {
        return
      }
    },
    treeSeekId3(parentArr, id) {
      if (parentArr.child && parentArr.child.length != 0) {
        for (let i = 0; i < parentArr.child.length; i++) {
          if (parentArr.child[i].data_id == id) {
            this.tempData.push(parentArr.child[i])
            // this.treeSeekId(this.treeData[0], parentArr.child[i].parent_id)
            return
          } else {
            this.treeSeekId(parentArr.child[i], id)
          }
        }
      } else {
        return
      }
    },
    treeSeekId2(parentArr, id) {
      if (parentArr.child && parentArr.child.length != 0) {
        for (let i = 0; i < parentArr.child.length; i++) {
          if (parentArr.child[i].data_id == id) {
            let a = parentArr.child[i]
            parentArr.child = []
            parentArr.child[0] = a
            return parentArr
          } else {
            let a = this.treeSeekId2(parentArr.child[i], id)
            if (a) {
              parentArr.child = []
              parentArr.child[0] = a
              let c = parentArr
              return c
            }
          }
        }
      }
    },

    reanderTree() {
      // console.log(JSON.parse(JSON.stringify(this.treeData[0].child)));
      let { data_id, name, parent_id, listId } = this.treeData[0];
      // this.expandedKey = data_id;
      this.selectItem = { data_id, name, parent_id, listId };
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEventNew({
          objectId: appId,
          componentId: componentId,
          type: "app",
          event: "reanderTree",
          payload: {
            dataId: this.selectItem.data_id,
            name: this.selectItem.name,
            parentId: this.selectItem.parent_id,
            listId: this.selectItem.listId,
          },
        });
    },
    async getData() {
      let that = this;
      let idArray = [
        {
          // id: "1e2dd93f-4fba-48d9-8de7-d990f31cfd2e",
          id: this.customConfig.oneAssetId,
          word: 'oneData',
          key: 'twoListId'
        },
        {
          // id: "f19f3bcb-2eea-4e4b-b9a2-259acb8533ae",
          id: this.customConfig.twoAssetId,
          word: 'twoData',
          key: 'threeListId'
        },
        {
          // id: "a1d54756-cebd-404f-b3ee-19878e1774dd",
          id: this.customConfig.threeAssetId,
          word: 'threeData',
          key: 'fourListId'
        },
        {
          // id: "d9129444-f4e4-4ddc-a0b8-d787ec022e99",
          id: this.customConfig.fourAssetId,
          word: 'fourData',
          key: 'fiveListId'
        },
        {
          // id: "b9169205-8c6f-4473-b529-4861b81f473e",
          id: this.customConfig.fiveAssetId,
          word: 'fiveData',
          key: 'fiveListId'
        },
      ]
      for (let i = 0; i < idArray.length; i++) {
        await getAssetById(idArray[i].id).then(res => {
          let words = idArray[i].word;
          let keys = idArray[i].key;
          let key = res.data[0];
          let value = res.data[1];
          that[words] = value.map(x => {
            let obj = {};
            obj.listId = this.customConfig[keys];
            key.forEach((y, index) => {
              obj[y.col_name] = x[index]
            })
            return obj;
          });
        }).catch(arr => {
          console.log(arr);
        });
      }
      this.allData()
    },
    allData() {
      this.fourData?.forEach(x => {
        x.child = [];
        this.fiveData?.forEach(y => {
          if (y.parent_id == x.data_id) {
            x.child.push(y)
          }
        })
      });
      this.threeData?.forEach(x => {
        x.child = [];
        this.fourData?.forEach(y => {
          if (y.parent_id == x.data_id) {
            x.child.push(y)
          }
        })
      });
      this.twoData?.forEach(x => {
        x.child = [];
        this.threeData?.forEach(y => {
          if (y.parent_id == x.data_id) {
            x.child.push(y)
          }
        })
      });
      this.oneData?.forEach(x => {
        x.child = [];
        x.parent_id = this.customConfig.rootDataId;
        this.twoData?.forEach(y => {
          if (y.parent_id == x.data_id) {
            x.child.push(y)
          }
        })
      })
      let root = [{
        data_id: this.customConfig.rootDataId,
        listId: this.customConfig.oneListId,
        name: "南山控股",
        parent_id: null,
        child: this.oneData
      }]
      this.treeData = root;
      if (this.treeData[0].data_id != this.office_id) {
        this.treeSeekId3(this.treeData[0], this.office_id)
        this.treeData[0] = this.tempData[0]
      }
      // if (this.treeData[0].data_id != this.office_id) {
      //   this.treeData[0] = this.treeSeekId2(this.treeData[0], this.office_id)
      // }

      // this.treeData[0]=
      // if (this.tempData.length != 0) {
      //   for (let i = this.tempData.length - 1; i > 0; i--) {
      //     let x = this.tempData[i]
      //     if (x.data_id != 'nanshan2-1-1') {
      //       this.tempData[i].child = []
      //       this.tempData[i].child[0] = this.tempData[i - 1]
      //     }
      //   }

      //   let i = this.tempData.pop()
      //   this.treeData[0].child = []
      //   this.treeData[0].child[0] = i
      // } else {
      //   this.treeData = []
      // }


      this.reanderTree();
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="edit_tree">
          {node.label}
        </div>
      )
    },
    do_EventCenter_getId(params) {
      console.log('默认选中', params);
      this.expandedKey = params.id;
      this.nsTreeShow = true;
    },
    Event_Center_getName() {
      return "接收默认选中";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>

<style lang="less" scoped>
.nanShan_tree {
  width: 100%;
  height: 100%;

  /deep/ .el-tree-node__content {
    margin-right: 10px;
    height: 40px;
    color: #757877;

    .el-tree-node__expand-icon {
      color: #3e403d;
      font-size: 12px;
      margin-left: 10px;
    }

    .el-tree-node__expand-icon.is-leaf {
      color: transparent;
    }

    .edit_tree {
      font-size: 14px;
      font-weight: 500;
      text-indent: 24px;
      height: 34px;
      line-height: 34px;
      margin-left: -22px;
      width: 100%;
    }
  }

  /deep/.el-tree-node.is-current>.el-tree-node__content {
    color: #fff !important;
    background-color: #ffffff;

    .edit_tree {
      background-color: #3354f2 !important;
      border-radius: 4px;
    }
  }

}
</style>
