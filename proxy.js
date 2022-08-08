module.exports = {
  "/api": {
    target: "http://140.246.90.106:6058/",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
