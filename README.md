[toc]

# smardaten前端组件二次开发

## 你需要知道的知识
+ [node.js](http://nodejs.cn/api/)
+ [Vue](https://cn.vuejs.org/),[React](https://zh-hans.reactjs.org/)二选一
(sdata-cli下载的为R4版本的模板，如果为R3版本环境需要使用R3版本的模板,且只能使用React编写二开插件)
## 开发前准备

+ scli方式
  1. 本地运行cmd命令，打开运行窗口。
  2. 执行以下命令全局安装sdata-cli服务。

  ```js
  npm install sdata-cli -g
  ```
  3. 安装完成后，运行scli i，选择对应模块及框架
  4. npm i或者yarn install安装相关依赖项，运行npm run serve(Vue版本)/npm run start(React版本)即可开始进行开发
+ github方式
  1. fork仓库[https://github.com/Orochi-sx/web-secondary--development](https://github.com/Orochi-sx/web-secondary--development/)
  2. 切换对应的分支及插件类型，如vue版本的应用插件为vue-version-app
  3. npm i或者yarn install安装相关依赖项，运行npm run serve(Vue版本)/npm run start(React版本)即可开始进行开发
## 页面及文件结构
### 应用，分析仪，大屏
应用，分析仪及大屏页面只有一个主页面文件，通常为App.vue/App.js

### 填报    

填报二开通常有六个文件需要编写,分别为add,child,preview,table,designConfiguration,set
* set
填报的配置页面组件展示区域
* designConfiguration
填报配置页面的配置项区域
* add
填报增删改页面展示
* child
填报插入字表组件页面展示
* table
填报在列表页中的展示
* preview
填报详情页页面展示

## 数据交互
### 应用
**`定义用户输入`**
config.json,customconf配置项

**`接收用户输入`**
* react version
  this.props.customConfi
* vue version
  this.customConfig
### 分析仪
**`定义用户输入`**
config.json,vars配置项

**`接收用户输入`**
* react version
  this.props.options.externalVariables
* vue version
  this.options.externalVariables

### 大屏
**`定义用户输入`**
交互-选择变量

**`接收用户输入`**
* vue version
  this.customConfig.variable.default_value
* react version
  this.props.variable.default_value

### 填报
**`定义用户输入`**
designConfiguration组件

**`接收用户输入`**
* vue version
  this.customConfig.configuration
* react version
  this.props.customConfig.configuration

$\color{red}{tips:注意加?.}$

## 数据源的获取
### 应用，分析仪，大屏

**`字符串形式`**
使用JSON.stringify()转化数据

**`查询资产`**
调用queryAssetById接口，数据图书馆资产

## 行为交互（逻辑控制）

### 概念引入

原生js的逻辑控制

```js
document.addEventListener("click",function(e){
  console.log(e.clientX)
})
```

### EventBus
```js
//注册事件
EventBus.register(eventName,function(){});

//触发事件
EventBus.triggerEvent(eventName,params)

```
### smardaten平台EventCenter(以应用二开为例)
```js
//组件挂载完成时，注册对应的事件与动作
const events = [
  {
    key: "selectedValueChange", name: "过滤条件变化", payload: [
      {
        key: "selectedValue", name: "过滤条件", dataType: "string"
      }
    ],
  }, {
    key: "searchValueChange", name: "搜索条件变化", payload: [
      {
        key: "searchValue", name: "搜索条件", dataType: "string"
      }
    ],
  }
];
const actions = [
  {
    key: "setValue",
    name: "设值",
    isSupportChild: true, // 是否支持子表(填报组件)
    params: [
      {
        key: "value",
        name: "值",
        dataType: "string"
      },
    ],
  },
  {
    key: "getValue",
    name: "取值",
    isSupportChild: true, // 是否支持子表(填报组件)
    hasReturn: true,
    returns: [
      {
        key: "value",
        name: "值",
        dataType: "string"
      },
    ],
  }
]
this.props?.customConfig?.componentId && window.componentCenter?.register(this.props?.customConfig?.componentId, "", this, {
      events, actions
    });
```

**`对应于EventBus的triggerEvent`**

```js
window.eventCenter?.triggerEvent(this.props?.customConfig?.componentId,
 "searchValueChange", {searchValue: val})
```

**`对应于 EventBus的register`**

>smardaten平台  组件的交互页签-逻辑绑定-新增逻辑

**`对应于 EventBus的function`**

>smardaten平台  组件的交互页签-逻辑绑定-新增逻辑-组件动作


### 补充(手写EventBus)

```js
class EventBus {
  constructor() {
    this.listeners = {};
  }
  register(eventName, callback) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push({
      callback
    });
  }
  triggerEvent(eventName, context) {
    let callbacks = this.listeners[eventName] || [];
    callbacks.forEach((callbackObj)=>{
      let callback = callbackObj.callback
      callback.call(null, context);
    })
  }
}
export default new EventBus();
```
## 远程调试及功能验证
### 远程调试
+ react版本
  修改proxy.js的target字段为代理地址，修改src/api/request.js中document.cookie的token和refreshToken字段为对应代理地址的相应字段即可实现远程调试
+ vue版本
  修改vue.config.js的target字段为代理地址，修改src/api/request.js中document.cookie的token和refreshToken字段为对应代理地址的相应字段即可实现远程调试
### 功能验证
上传二开插件包到验证环境上，创建对应的字段即可。其他的功能验证与本地验证基本一致
逻辑控制的验证，需要点到二开组件的交互界面，点击相应事件名，添加相应的打印输出逻辑，即可判断事件是否已经接入smardaten平台
如果是动作，则可搭建最简单的场景，如一个按钮，点击事件触发对应的动作，看能否正常生效即可。