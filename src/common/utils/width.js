/**
 * 根据宽度配置，生成宽度样式
 * @param {Object} widthConfig
 * @param {(number|undefined)} widthConfig.width 宽度值，如果没有设置，值为 undefined，这时以 100% 显示
 * @param {string} widthConfig.widthUnit 单位 px / %
 * @returns {string} 宽度值：'100%' / '640px'
 */
const getWidth = (params = {}) => {
  const { width, widthUnit } = params;
  if (!width) {
    return '100%';
  } else {
    return `${width}${widthUnit}`;
  }
};

export { getWidth };
