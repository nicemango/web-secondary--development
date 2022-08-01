const { defineConfig } = require("@vue/cli-service");
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        target: "http://10.15.111.9:12245",
        logLevel: "debug",
        changeOrigin: true,
        pathRewrite: {
          "/api": "",
        },
      },
    },
  },
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === "production", config => {
      config.optimization.splitChunks(false);
      config.plugins.delete("extract-css");

      ["postcss", "scss", "css", "sass", "less", "stylus"].forEach(element => {
        ["vue-modules", "vue", "normal-modules", "normal"].forEach(m => {
          config.module
            .rule(element)
            .oneOf(m)
            .uses.delete("extract-css-loader")
            .end()
            .use("vue-style-loader")
            .loader("vue-style-loader")
            .options({
              sourceMap: false,
              shadowMode: false,
            })
            .before("css-loader");
        });
      });
    });
  },
});
