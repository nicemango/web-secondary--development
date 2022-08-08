import React, { Component } from "react";
import { Button, Spin, Modal, message } from "antd";
import * as applicationsService from "./api/asset";
// import { Icon } from "sdata-ui";
import qs from "querystringify";
import ErrMessage from "./errMessage";
import {
  getDefaultValues,
  getSaveDefaultValues,
  formatError,
  ErrorCode,
} from "./utils";
import Form from "./form";
import "./app.less";

const dataObj = {
  "deal-approval": "pendingHandleTasks",
  "processed-approval": "handleTasks",
  "initiate-approval": "applyInstances",
  "copy-approval": "notifyTasks",
  all: "allInstances",
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.query = props.location
      ? qs.parse(props.location.search)
      : {
          ...qs.parse(window.location.search),
          ...props,
        };
    console.log(this.query);
    this.state = {
      dataSource: [],
      data: {},
      objectId: this.query.objectid,
      errType: null,
      defaultValues: null,
      flowConfigList: {},
      components: [],
      flowConfigListLength: 0,
      collectivevariable: {},
    };
    this.Form = React.createRef();
  }

  componentDidMount() {
    if (localStorage.getItem("project_name")) {
      let tempArr = window.location.href.split("&");
      let index = 0;

      tempArr.map((item, i) => {
        if (item.indexOf("project_name") !== -1) {
          index = i;
        }
      });

      tempArr[index] = `project_name=${localStorage.getItem("project_name")}`;
      window.location.href = tempArr.join("&");
      localStorage.removeItem("project_name");
    }

    const events = [
      {
        key: "jumpButton",
        name: "跳转按钮",
        payload: [],
      },
    ];

    const actions = [
      {
        key: "messageSuccess",
        name: "刷新页面",
      },
    ];
    this.props?.customConfig?.componentId &&
      window.componentCenter?.register(
        this.props?.customConfig?.componentId,
        "",
        this,
        {
          events,
          actions,
        }
      );
    this.queryAllById();
    let search =
      window.location && window.location.search
        ? qs.parse(window.location?.search)
        : {};
    let defaultValue = search.defaultValue
      ? JSON.parse(search.defaultValue)
      : {};
    this.setState({ defaultValue });
  }

  queryBasicInfoById = async () => {
    const { type } = this.query;
    try {
      let { data } = await (!this.query.data_id
        ? this.query.objectid
          ? applicationsService.queryBasicInfoById(
              this.query.objectid,
              dataObj[this.query.type]
            )
          : applicationsService.queryByFormId(
              this.query.formid || this.query?.form_id
            )
        : applicationsService.queryBasicInfo4Form({
            flowInstId: this.query.flow_inst_id,
            flowComponentConstantId: this.query.flow_component_constant_id,
            formId: this.query.form_id,
            dataId: this.query.data_id,
          }));
      let flowConfigList = {};
      let flowConfigListLength = 0;
      if (data.flowConfigList) {
        data.flowConfigList.forEach((item) => {
          flowConfigList[item.type] = item.value;
          if (
            (item.type === "form_area_flag" ||
              item.type === "flow_chart_flag" ||
              item.type === "approval_details_flag") &&
            item.value === "1"
          ) {
            flowConfigListLength++;
          }
        });
      }
      this.setState(
        {
          data: { ...this.state.data, ...data },
          loading: false,
          flowConfigList,
          flowConfigListLength,
          errType: null,
        },
        async () => {
          if (
            data?.flow_chart_area_auth_show_flag === 1 &&
            flowConfigList.flow_chart_flag === "1" &&
            type !== "copyData" &&
            data?.flowInstance?.current_flow_inst_task?.current_flow_component
              ?.shape !== "start"
          ) {
            // await this.queryFlowDiagram();
          }

          await this.initData(
            data?.flowInstance?.process_status,
            data?.form_id,
            data?.flowInstance?.content_id
          );
        }
      );
    } catch (error) {
      this.setState({
        loading: false,
      });
      if (error?.data?.code) {
        // eslint-disable-next-line default-case
        switch (error.data.code) {
          case 10140001:
            this.setState({ errType: 1 });
            return;
          case 10140002:
            this.setState({ errType: 0 });
            break;
          case 10140003:
            message.error(error?.data?.message);
            setTimeout(() => {
              window.close();
            }, 2000);
            break;
        }
      } else {
        message.error(error?.data?.message);
      }
    }
  };

  queryFlowDiagram = async () => {
    const { type } = this.query;
    try {
      let { data } = await applicationsService.queryFlowDiagram(
        !this.query.data_id
          ? {
              objectId: this.state.objectId,
              listType: dataObj[this.query.type],
            }
          : {
              type,
              formId: this.query.form_id,
              flowInstId: this.query.flow_inst_id,
            }
      );
      data.canvas_detail = data.canvas_detail && JSON.parse(data.canvas_detail);

      this.setState({
        data: { ...this.state.data, ...data },
        loading: false,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
      if (error?.data?.code) {
        // eslint-disable-next-line default-case
        switch (error.data.code) {
          case 10140001:
            this.setState({ errType: 1 });
            return;
          case 10140002:
            this.setState({ errType: 0 });
        }
      } else {
        error.data && message.error(error?.data?.message);
      }
    }
  };

  onAddEvent = async (type, button, process_status) => {
    const { data, saveloading, defaultValues, components } = this.state;
    if (saveloading) {
      return;
    }
    const allFormData = this.Form.current.myForm;

    this.setState({ saveloading: true, formVisible: false, visible: false });
    // let formData = getSaveDefaultValues(components, defaultValues);
    let formData = getSaveDefaultValues(
      components,
      allFormData,
      type !== "save"
    );

    // console.log(this.Form.current.state.arrObj, '===============form');

    console.log("===", formData);
    let flowComponentList;
    try {
      await applicationsService.apply(
        !process_status && !this.query.data_id
          ? {
              applyType: type,
              formData,
              flow_id: this.query.data_id ? data?.flowInstance?.id : data?.id,
              flowComponentItemId: button.id,
            }
          : {
              applyType: type,
              flow_inst_id: this.query.data_id
                ? data?.flowInstance?.id
                : this.state.objectId,
              updateFormData: formData,
              flowComponentList,
              flowComponentItemId: button.id,
            }
      );

      let messageString = type !== "save" ? "发起成功" : "保存成功";

      message.success(
        button.prompt && button.prompt !== "" ? button.prompt : messageString
      );
      this.setState({ saveloading: false });
      if (data?.backList) {
        this.closeFunction();
      }
    } catch (err) {
      if (err.data.code === 10130009) {
        let messages = formatError(err);
        this.setState({ saveloading: false });
        return message.error(
          <span dangerouslySetInnerHTML={{ __html: messages }} />
        );
      }
      this.setState({ saveloading: false }, () => {
        if (
          err &&
          err.data &&
          err.data.code &&
          err.data.code >= 10130000 &&
          err.data.code <= 10139999 &&
          err.data.code !== 10130009
        ) {
          message.error(ErrorCode[err]);
        }
      });
    }
  };

  onChangeForm = async (type, button, flow, reporting) => {
    const { data, defaultValues, components } = this.state;
    let formData = getSaveDefaultValues(components, defaultValues);
    let flow_inst_id = data?.flowInstance?.current_flow_inst_task?.flow_inst_id;
    let showType = {};
    if (type === "updateTmpSave") {
      showType = { saveType: "tmpSave" };
    }
    let params = {
      task_id:
        this.query.type !== "manage"
          ? flow_inst_id || this.state.objectId
          : undefined,
      flow_inst_id:
        this.query.type === "manage"
          ? flow_inst_id || this.state.objectId
          : undefined,
      updateFormData: { ...formData, ...{ draft: false } },
      ...showType,
    };
    try {
      await applicationsService.modifyFormData(params);
      setTimeout(() => {
        message.success(
          button.prompt && button.prompt !== "" ? button.prompt : "修改成功"
        );
      }, 2000);
      this.closeFunction();
    } catch (err) {
      if (
        err?.data?.code &&
        err.data.code >= 10130000 &&
        err.data.code <= 10139999
      ) {
        message.error(ErrorCode[err.data.code]);
      } else {
        message.error(err.data.message);
      }
    }
  };

  actionBtnClick = (item, process_status) => {
    if (
      !item.flowComponentItemConfig ||
      item.flowComponentItemConfig?.surface_type === "none"
    ) {
      if (item?.type === "save") {
        this.setState({ btnObj: item }, () =>
          this.onAddEvent(process_status ? "update" : "save", item)
        );
      } else {
        this.setState({ btnObj: item }, () => this.handleAndModify(item));
      }
    } else {
      this.setState(
        {
          visible: item.flowComponentItemConfig?.surface_type === "formView",
          formVisible:
            item.flowComponentItemConfig?.surface_type === "internal",
          btnObj: item,
        },
        () => this.handleAndModify(item)
      );
    }
  };

  taskReject = async (data) => {
    const id = data?.flowInstance?.current_flow_inst_task?.id;
    try {
      await applicationsService.rejectHandleTask(id);
      localStorage.setItem("eventflowDealListReload", true);
      window.close();
    } catch {
      message.error("拒接失败");
    }
  };

  handleAndModify = async (item) => {
    const {
      btnObj,
      btnObj: {
        prompt,
        flowComponentItemConfig: { surface_type, surface_object_id } = {},
      } = {},
      objectId,
      components,
      data: { flowInstance: { current_flow_inst_task: { id } = {} } = {} } = {},
      defaultValues,
    } = this.state;
    this.setState({
      formVisible: false,
      visible: false,
    });

    const allFormData = this.Form.current.myForm;
    let formData = getSaveDefaultValues(components, allFormData, true);
    console.log("===", formData);
    this.setState({
      saveloading: true,
    });
    const params = {
      task_id: id || objectId,
      updateFormData: { ...formData, ...{ draft: false } },
      component_item_id: btnObj.id,
      surface_type,
      surface_object_id: surface_object_id || "1000000001",
      detail: surface_type === "internal" ? "1" : "111",
      formData: surface_type === "formView" ? item : undefined,
    };

    const handle = async () => {
      // console.log('this', this);
      try {
        await applicationsService.handleAndModify(params);
        this.setState({
          saveloading: false,
        });
        message.success(prompt && prompt !== "" ? prompt : "执行成功");
      } catch (err) {
        this.setState({ saveloading: false });
        if (
          err?.data?.code &&
          err.data.code >= 10130000 &&
          err.data.code <= 10139999 &&
          this.reporting?.messageError
        ) {
          this.reporting.messageError(err);
        } else {
          message.error(err.data.message);
        }
      }
    };
    handle();
  };

  initData = async (flag, form_id, id) => {
    const { data } = await applicationsService.queryComponents(
      form_id || this.query?.formid || this.query?.form_id
    );
    if (flag) {
      const { data: _data } =
        await applicationsService.queryApplyDataDetailFormId({
          formId: form_id || this.query?.formid || this.query?.form_id,
          id: id || this.query.data_id,
        });
      this.setState({
        components: JSON.parse(data)?.formColumnList,
        defaultValues: getDefaultValues(
          JSON.parse(data)?.formColumnList || [],
          _data || {}
        ),
      });
    } else {
      this.setState({
        components: JSON.parse(data)?.formColumnList,
        defaultValues: getDefaultValues(
          JSON.parse(data)?.formColumnList || [],
          {}
        ),
      });
    }
  };

  buttons = () => {
    const { type } = this.query;
    const {
      nodeformEditCount,
      data,
      data: {
        print_detail,
        flowInstance: {
          process_status,
          auth_type_list = [],
          current_flow_inst_task: {
            act_buttons = [],
            current_flow_component: { flowComponentItemList = [] } = {},
          } = {},
        } = {},
      } = {},
      flowConfigList: { flow_savebtn_flag } = {},
    } = this.state;
    const pendingApply = [
      "pendingApply",
      "revoked",
      "beatBack",
      "start",
    ].includes(process_status || "start");
    const processing = [
      "processing",
      "process_status",
      "pendingApply",
    ].includes(process_status || "start");
    const revoked = ["revoked", "beatBack"].includes(process_status);

    let _flowComponentItemList, handleBtns;
    if (pendingApply) {
      _flowComponentItemList = flowComponentItemList;
      handleBtns =
        flowComponentItemList.filter(
          (item) => !["tmpSave"].includes(item.type)
        ) || [];
    } else {
      _flowComponentItemList = act_buttons;
      handleBtns =
        act_buttons.filter(
          (item) =>
            item.type === "handle" ||
            (item.type === "reject" && item.show_flag !== 0)
        ) || [];
    }
    const saveBtn =
      _flowComponentItemList.find((item) => item.type === "save") || {};

    let _show = 2;
    let printConfig = [];
    if (print_detail) {
      if (!print_detail.show) {
        data.print_detail = JSON.parse(print_detail);
      }
      const { show, showCol } = data.print_detail || {};
      _show = show;
      for (let key in showCol) {
        printConfig.push(
          showCol[key] === 2
            ? {
                id: key,
                columnStyle: {
                  operate_attribute: "1", // 1为禁用，2为只读，都没有则是可编辑
                },
              }
            : showCol[key] === 3
            ? {
                id: key,
                hide: true,
              }
            : {}
        );
      }
    }
    const auth = auth_type_list.includes(2);

    let res = [];
    if (type !== "manage" && handleBtns) {
      handleBtns.map((item, index) => {
        res.push(
          <Button
            key={index}
            type={item.type === "save" && !processing ? undefined : "primary"}
            onClick={() => {
              if (item.type === "apply") {
                this.onAddEvent(
                  !process_status ? "saveAndApply" : "updateAndApply",
                  item,
                  process_status
                );
              } else if (item.type === "reject") {
                Modal.confirm({
                  title: "是否确认拒接此任务？",
                  okText: "确定",
                  cancelText: "取消",
                  maskClosable: true,
                  onOk: () => {
                    this.taskReject(data);
                  },
                });
              } else {
                this.actionBtnClick(item, process_status);
              }
            }}
          >
            {item.name}
          </Button>
        );
      });
    }
    if (type === "task-dispatch") {
      res.push(
        <>
          <Button type="primary" onClick={() => this.taskDispatch(data)}>
            任务派发
          </Button>
          <Button
            type="primary"
            onClick={() => {
              process_status === "processing"
                ? this.onChangeForm("update", saveBtn)
                : this.onAddEvent("update", saveBtn);
            }}
          >
            {saveBtn.name || "保存"}
          </Button>
        </>
      );
    }
    if (auth && type === "manage" && process_status === "processing") {
      res.push(
        <>
          <Button type="primary" onClick={() => this.showFinishConfirm(data)}>
            直接完成
          </Button>
          <Button type="primary" onClick={() => this.showBackConfirm(data)}>
            打回
          </Button>
          <Button
            type="primary"
            onClick={() => {
              this.setState({
                showJumpVisible: true,
              });
            }}
          >
            跳转
          </Button>
        </>
      );
    }
    if (
      (auth && ["all", "manage"].includes(type)) ||
      (processing &&
        flow_savebtn_flag === "1" &&
        saveBtn.show_flag === 1 &&
        nodeformEditCount > 0)
    ) {
      res.push(
        <Button
          onClick={() => {
            process_status === "processing"
              ? this.onChangeForm("update", saveBtn)
              : this.onAddEvent("update", saveBtn);
          }}
        >
          {saveBtn.name || "保存"}
        </Button>
      );
    }
    if (pendingApply && _show === 1) {
      res.push(
        <Button onClick={() => this.printClick(data, printConfig)}>打印</Button>
      );
    }
    return res;
  };

  do_EventCenter_messageSuccess() {
    window.location.reload();
  }

  // 逻辑控制用，不可删
  Event_Center_getName() {
    return "应用二开测试";
  }
  onCancel = () => {};
  queryAllById = async () => {
    await this.queryBasicInfoById();
  };

  render() {
    const { data, errType, defaultValues } = this.state;
    return (
      <Spin spinning={false} className="my-spin">
        <div className="event-details">
          <div className="content">
            {errType === 0 && <ErrMessage url="end" text={"该任务已处理"} />}
            {errType === 1 && (
              <ErrMessage url="not-found" text={"该任务不存在"} />
            )}
            <div className="content-header">
              <div className="header-left">
                {/* <Icon
                  className="goBackButton"
                  type="icon-fangxiangjiantou"
                  onClick={() => {
                    this.onCancel();
                  }}
                /> */}
                <div className="title">
                  {this.props.menuName ||
                    this.query.menuName ||
                    data.name ||
                    ""}
                </div>
              </div>
              <div className="header-right">{this.buttons()}</div>
            </div>
            <div
              className="content-content"
              style={{
                width: "calc(100% - 80px)",
                margin: "24px 40px",
                height: "calc(100% - 122px)",
              }}
            >
              {defaultValues && (
                <Form
                  defaultValue={defaultValues}
                  ref={this.Form}
                  processStatus={this.state.data?.flowInstance?.process_status}
                />
              )}
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}
