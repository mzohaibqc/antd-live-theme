const fs = require('fs');
const path = require('path');
const lessToJs = require('less-vars-to-js');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');

module.exports = [
  ['use-babel-config', '.babelrc'],
  ['use-eslint-config', '.eslintrc'],
  config => {
    const newConfig = config;
    let rule = newConfig.module.rules.find(rule => rule.oneOf);
    const paletteLess = fs.readFileSync('./src/styles/variables.less', 'utf8');
    const variables = lessToJs(paletteLess);
    const options = {
      antDir: path.join(__dirname, './node_modules/antd'),
      stylesDir: path.join(__dirname, './src/styles'),
      varFile: path.join(__dirname, './src/styles/variables.less'),
      mainLessFile: path.join(__dirname, './src/styles/index.less'),
      themeVariables: Object.keys(variables), // ['@primary-color', '@secondry-color', '@text-color-secondary', '@text-color', '@processing-color', '@layout-header-background', '@heading-color', '@btn-primary-bg'],
      indexFileName: 'index.html',
      generateOnce: false
    }
    
    
    const themePlugin = new AntDesignThemePlugin(options);
    
    
    rule.oneOf.unshift({
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader'
        },
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
            modifyVars: variables
          }
        }
      ]
    });
    config.plugins.push(themePlugin);
    return newConfig;
  }
];
