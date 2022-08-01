# om-analyzer-plugin-vue3-boilerplate

使用 vue3 开发 onemind 分析仪插件的 boilerplate 工程

# 支持功能

* 开发预览
* 一键打包 （npm run plugin）
* css / less / scss 支持
* element-plus 按需自动引入
* 接口封装，支持开发请求代理

# 使用

```
npm install     # 下载依赖
npm run serve   # 本地开发
npm run build   # build js
npm rum plugin  # 生成插件 zip 包
```
## 开发测试
1. 测试数据请在 src/mockData.ts 中编写
2. 若需要调用平台接口，请在 src/mockData.ts 文件中输入用户名和密码