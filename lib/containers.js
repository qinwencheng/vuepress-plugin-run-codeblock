const mdContainer = require('markdown-it-container');

module.exports = md => {
  //将markdown-it-container插件加载到当前的解析器实例中
  md.use(mdContainer, 'run', {
    validate(params) {
      //函数在开始标记后验证尾部，成功时返回true
      return params.trim().match(/^run\s*(.*)$/);
    },
    render(tokens, idx) {
      //渲染器函数
      const m = tokens[idx].info.trim().match(/^run\s+(.*)$/);
      if (tokens[idx].nesting === 1) {
        const description = m && m.length > 1 ? m[1] : '';
        const codeBlockInfo = {};
        codeBlockInfo['name'] = tokens[idx].info.trim().split(' ')[1]
        for (let i = idx; i < tokens.length; i++) {
          const { type, content, info } = tokens[i];
          if (type === "container_run_close") break;
          if (!content) continue;
          if (type === "fence") {
            codeBlockInfo['language'] = info;
            codeBlockInfo['code'] = content;
          }
        }
        // opening tag
        return `<codeBlock codeBlockInfo="${encodeURIComponent(JSON.stringify(codeBlockInfo))}">\n`;
      } else {
        // closing tag
        return `</codeBlock>\n`
      }
    }
  });
}
