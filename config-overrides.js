const path = require('path');
const { updateConfig } = require('react-app-rewire-antd-theme');

const options = {
  stylesDir: path.join(__dirname, './src/styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/styles/variables.less'),
  mainLessFile: path.join(__dirname, './src/styles/index.less'),
  themeVariables: [
    '@primary-color',
    '@secondary-color',
    '@text-color',
    '@text-color-secondary',
    '@heading-color',
    '@layout-body-background',
    '@btn-primary-bg',
    '@layout-header-background',
    '@menu-bg'
  ],
  indexFileName: 'index.html'
}
module.exports = function override(config, env) {
  config = updateConfig(config, env, options)
  return config;
};

/*
  You can also do this by using "antd-theme-webpack-plugin" like this.
*/
// const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
// const { injectBabelPlugin } = require('react-app-rewired');
// const rewireLess = require('react-app-rewire-less');

// const options = {
//   varFile: path.join(__dirname, './src/styles/variables.less'),
//   themeVariables: ['@primary-color', '@secondry-color', '@text-color-secondary', '@text-color']
// }

// const themePlugin = new AntDesignThemePlugin(options);
// module.exports = function override(config, env) {
//   config = rewireLess.withLoaderOptions({
//     modifyVars: {
//       '@primary-color': '#003590',
//       '@text-color': '#000'
//     }
//   })(config, env);
//   config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
//   config.plugins.push(themePlugin);
//   return config;
// };