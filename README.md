# Ant Design (Less) Live Theming
This project is a guide to achieve live/dynamic theming related to colors. You can change theme in browser.
This is basically for React app generated with `create-react-app`. You can use https://github.com/mzohaibqc/antd-theme-webpack-plugin to  acheive this in any project using webpack.

## Demo
![Theme](https://github.com/mzohaibqc/antd-live-theme/blob/master/public/theme.PNG)

https://antd-live-theme.firebaseapp.com/


## Requirements
- A `variables.less` file in `/src/styles` directory containing color variables.Import Ant Design `default.less`
in this file at top `node_modules/antd/lib/style/themes/default.less`.
- Use same color variables in `config-overrides.js` or use `getLessVars` function to copy variables from `variables.less` file to remain consistant. Check `config-overrides.js` in this project
- You can use npm `react-app-rewire-antd-theme` or `antd-theme-webpack-plugin` to achieve dynamic theming.

Use `react-app-rewire-antd-theme` if you don't want to eject your app. Add folowing code in `config-overrides.js` file
```
const path = require('path');
const { updateConfig } = require('react-app-rewire-antd-theme');

const options = {
  stylesDir: path.join(__dirname, './src/styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/styles/variables.less'),
  mainLessFile: path.join(__dirname, './src/styles/index.less'),
  themeVariables: ['@primary-color', '@secondary-color', '@text-color', '@text-color-secondary', '@heading-color'],
  indexFileName: 'index.html'
}
module.exports = function override(config, env) {
  config = updateConfig(config, env, options)
  return config;
};
```

Use `antd-theme-webpack-plugin` in `config-overrides.js` file if you have webpack config file in any kind of project with similar structure or you have ejected your create-react-app app.

```
const path = require('path');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

const options = {
  varFile: path.join(__dirname, './src/styles/variables.less'),
  themeVariables: ['@primary-color', '@secondry-color', '@text-color-secondary', '@text-color']
}

const themePlugin = new AntDesignThemePlugin(options);
module.exports = function override(config, env) {
  config = rewireLess.withLoaderOptions({
    modifyVars: {
      '@primary-color': '#003590',
      '@text-color': '#000'
    }
  })(config, env);
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
  config.plugins.push(themePlugin);
  return config;
};
```

In order to integrate with your webpack configurations, install the package and add following code in your webpack config file.

```js
const path = require('path');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');

const options = {
  antDir: path.join(__dirname, './node_modules/antd'),
  stylesDir: path.join(__dirname, './src/styles'),
  varFile: path.join(__dirname, './src/styles/variables.less'),
  mainLessFile: path.join(__dirname, './src/styles/index.less'),
  themeVariables: ['@primary-color', '@text-color'],
  indexFileName: 'index.html'
}

const themePlugin = new AntDesignThemePlugin(options);
// in config object
plugins: [
    themePlugin
  ]
```
Here are some more sample projects. https://github.com/mzohaibqc/antd-theme-webpack-plugin/tree/master/examples

Now simply run `npm start` and you are good to go.

Run `window.less.modifyVars({'@primary-color': '#ff0000', '@text-color': '#e3e3e3'})` in you code to update the colors. These two color variables are just for example and these two must be in `variables.less`

I hope it helps :)