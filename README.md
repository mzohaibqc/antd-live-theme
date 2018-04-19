# Ant Design (Less) Live Theming
This project is a guide to achieve live/dynamic theming related to colors. You can change theme in browser.
This is basically for React app generated with `create-react-app` but can be used with other projects with minor 
change in `generate-color.js` file in this project.

## Demo
![Theme](https://github.com/mzohaibqc/antd-live-theme/blob/master/public/theme.PNG)

https://antd-live-theme.firebaseapp.com/


## Requirements
- A `variables.less` file in `/src/styles` directory containing color variables
- Use same color variables in `config-overrides.js` or use `getLessVars` function to copy variables from `variables.less` file to remain consistant. Check `config-overrides.js` in this project

- Update `package.json` file with following content. We need to add some scripts and a `watch` section
- Add folowing code in `config-overrides.js` file
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
- Now simply run `npm start` and you are good to go.

- Run `window.less.modifyVars({'@primary-color': '#ff0000', '@text-color': '#e3e3e3'})` in you code to update the colors. These two color variables are just for example and these two must be in `variables.less`



I hope it helps :)