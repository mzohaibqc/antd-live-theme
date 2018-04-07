# Ant Design (Less) Live Theming
This project is a guide to achieve live/dynamic theming related to colors.


## Requirements
- A `variables.less` file in `/src/styles` directory containing color variables 
- Use same color variables in `config-overrides.js` or use `getLessVars` function to copy variables from `variables.less` file to remain consistant. Check `config-overrides.js` in this project
- Add a link `<link rel="stylesheet/less" type="text/css" href="color.less" />` after root div in `public/index.html` file like this
```html
    <div id="root"></div>
    <link rel="stylesheet/less" type="text/css" href="color.less" />
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
