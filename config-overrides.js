const { getLoader, loaderNameMatches, injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const fs = require('fs');
const path = require('path');
const { getLessVars } = require('./generate-theme');

const varFile = path.join(__dirname, './src/styles/variables.less');
const vars = getLessVars(varFile);
module.exports = function override(config, env) {
  config = rewireLess.withLoaderOptions({
    modifyVars: vars
  })(config, env);
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
  config.entry.push('./src/styles/index.less');
  return config;
};
