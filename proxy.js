module.exports = {
  "/api": {
    target: "http://10.15.112.2:18083/",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
