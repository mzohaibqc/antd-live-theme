# Ant Design (Less) Live Theming
This project is a guide to achieve live/dynamic theming related to colors. You can change theme in browser.
This is basically for React app generated with `create-react-app` but can be used with other projects with minor 
change in `generate-color.js` file in this project.

## Demo
![Theme](https://github.com/mzohaibqc/antd-live-theme/blob/master/public/theme.PNG)

https://mzohaibqc.github.io/antd-live-theme/


## Requirements
- A `variables.less` file in `/src/styles` directory containing color variables and `theme.less` file containing 
only those color varibales that we want to update at runtime.
- Use same color variables in `config-overrides.js` or use `getLessVars` function to copy variables from `variables.less` file to remain consistant. Check `config-overrides.js` in this project
- Add add following right after your root div in `public/index.html` file like this
```html
    <div id="root"></div>
    <link rel="stylesheet/less" type="text/css" href="/color.less" />
    <script>
      window.less = {
        async: true,
      };
    </script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js"></script>
```

- Install following dependencies
- `npm i -D npm-watch` // to rerun colors script when variables.less file will change
- `npm i -D npm-run-all` // in order to run scripts in parallel

- Update `package.json` file with following content. We need to add some scripts and a `watch` section
```js
{
    "watch": {
    "colors": {
      "patterns": [
        "src/styles"
      ],
      "extensions": "less",
      "ignore": "src/vendor/external.min.js",
      "quiet": true,
      "legacyWatch": true
    }
  },
  "scripts": {
    "start": "run-p watch start-app",
    "start-app": "react-app-rewired start",
    "colors": "node generate-theme.js",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test --env=jsdom",
    "eject": "react-scripts eject",
    "watch": "npm-watch colors"
  }
}
```

- Run `window.less.modifyVars({'@primary-color': '#ff0000', '@text-color': '#e3e3e3'})` in you code to update the colors. These two color variables are just for example and these twomust be in `variables.less` and `theme.less`

Now running `npm start` will kick another parallel color generation task which will run whenever you will update 
your styles inside `/src/styles` directory and will generate a `color.less` file in `public` directory which is being used to compile new css to override color related styles.

I hope it helps :)