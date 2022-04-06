const path = require('path');
const codeBlockContainers = require('./containers')

module.exports = (options, ctx) => {
  return {
    name: 'vuepress-plugin-run-codeblock',
    enhanceAppFiles: [
      path.resolve(__dirname, 'enhanceApp.js')
    ],
    chainMarkdown(config) {
      //修改内部的 markdown 配置
      config // 增加额外的插件markdownContainers
        .plugin('markdownContainers')
        .use(codeBlockContainers)
        .end();
    }
  }
}