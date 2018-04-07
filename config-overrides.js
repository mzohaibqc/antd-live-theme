const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const fs = require('fs');
const path = require('path');
const { getLessVars } =  require('./generate-theme');

console.log(getLessVars);
const varFile = path.join(__dirname, './src/styles/variables.less');
const vars = getLessVars(varFile);
console.log('vars', vars);
module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
  config = rewireLess.withLoaderOptions({
    modifyVars: vars  //{ "@primary-color": "#1DA57A" },
  })(config, env);
  return config;
};
