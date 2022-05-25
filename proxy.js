module.exports = {
  '/api': {
    'target': '',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}