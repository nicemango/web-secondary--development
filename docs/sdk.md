---
title: sdk
nav:
  title: 大屏
  path: /bigcreen
group:
  title: sdk
  path: /dev
toc: menu
---

## **场景说明**

如果开发插件涉及到使用JS SDK基础API功能，并且数睿企业级无代码开发平台也提供此能力，用户可通过接入JS SDK实现。

## **操作步骤**

步骤1、打开cmd窗口，执行以下命令安装JS SDK。

**npm install @sdsdk/app-sdk**

步骤2、使用以下命令将app-sdk引入二开插件中。

**import {registerStore} from '@sdsdk/bigscreen-sdk';**

| 字段 | 说明 |
| --- | --- |
| @sdsdk/app-sdk | JS SDK名称 |
| getPageData | 接口名称。此处以registerStore为例，目前支持的接口主要包括：registerStore，getBlockData，getBlockOptions，getBlockVariables。 |

## 接口名称

### registerStore

* 描述：注册大屏的 api，注册后可以在插件内使用大屏的API。
* 参数：无。
* 返回值：无。

### getBlockData

* 描述：获取配置的大屏数据 bigScreen\_data。
* 参数：无。
* 返回值：参考开发插件一节的内容。

### getBlockOptions

* 描述：获取配置数据 bigScreen\_options。
* 参数：无。
* 返回值：参考开发插件一节的内容。

### getBlockVariables

* 描述：获取大屏配置的变量数据 variable。
* 返回值：参考开发插件一节的内容。
