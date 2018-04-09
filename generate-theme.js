#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const postcss = require('postcss');
const less = require('less');

const antd = path.resolve(__dirname, './node_modules/antd/');
const defaultLess = path.join(antd, 'lib/style/themes/default.less');
const defaultLessColors = fs.readFileSync(defaultLess).toString();
const varFile = path.join(__dirname, './src/styles/variables.less');
const themeFile = path.join(__dirname, './src/styles/theme.less');
const variables = getLessVars(varFile);
const themeVars = getLessVars(themeFile);
const bezierEasing = fs
  .readFileSync(path.join(antd, 'lib/style/color/bezierEasing.less'))
  .toString();
const tinyColor = fs
  .readFileSync(path.join(antd, 'lib/style/color/tinyColor.less'))
  .toString();
const colorPalette = fs
  .readFileSync(path.join(antd, 'lib/style/color/colorPalette.less'))
  .toString()
  .replace('@import "bezierEasing";', '')
  .replace('@import "tinyColor";', '');
const scripts = `${bezierEasing}\n${tinyColor}\n${colorPalette}\n`;
const entry = path.join(antd, 'lib/style/index.less');
let content = fs.readFileSync(entry).toString();
const styles = glob.sync(path.join(antd, 'lib/*/style/index.less'));
content += '\n';
styles.forEach(style => {
  content += `@import "${style}";\n`;
});
const indexFile = path.join(__dirname, './src/styles/index.less');
const customStyles = fs.readFileSync(indexFile).toString();
content += `\n${customStyles}`;
content += `\n${defaultLessColors}`;
Object.keys(variables).forEach(varName => {
  if (varName in themeVars) return;
  content += `\n${varName}: ${variables[varName]};`;
});

const reducePlugin = postcss.plugin('reducePlugin', () => {
  const cleanRule = rule => {
    if (rule.selector.startsWith('.main-color .palatte-')) {
      rule.remove();
      return;
    }
    let removeRule = true;
    rule.walkDecls(decl => {
      if (
        !decl.prop.includes('color') &&
        !decl.prop.includes('background') &&
        !decl.prop.includes('border') &&
        !decl.prop.includes('box-shadow')
      ) {
        decl.remove();
      } else {
        removeRule = false;
      }
    });
    if (removeRule) {
      rule.remove();
    }
  };
  return css => {
    css.walkAtRules(atRule => {
      atRule.remove();
    });

    css.walkRules(cleanRule);

    css.walkComments(c => c.remove());
  };
});

render(content)
  .then(({ css }) => {
    return postcss([reducePlugin]).process(css, {
      parser: less.parser,
      from: entry
    });
  })
  .then(({ css }) => {
    replacePrimaryColors().then(mappings => {
      const colorToNames = mappings.cTn;
      Object.keys(colorToNames).forEach(color => {
        const varName = colorToNames[color];
        console.log(varName, color, color.length);
        if (varName in themeVars || varName.includes('primary')) {
          color = color.replace('(', '\\(').replace(')', '\\)');
          if (isValidColor(color)) {
            console.log(varName, color, color.length);
            css = css.replace(new RegExp(`${color}`, 'g'), `${varName}`);
          }
        }
      });

      css = `${scripts}\n${css}`;
      Object.keys(themeVars)
        .reverse()
        .forEach(varName => {
          css = `${varName}: ${variables[varName]};\n${css}`;
        });
      fs.writeFileSync(path.resolve(__dirname, './public/color.less'), css);
      console.log('color.less generated successfully');
    });
  })
  .catch(error => {
    console.log('Error colors, default extraction', error);
    return { css: '' };
  });

function generateColorMappings() {
  const colorFile = path.join(antd, 'lib/style/color/colors.less');
  let colors = fs.readFileSync(colorFile).toString();
  colors = colors
    .split('\n')
    .filter(line => line.startsWith('@') && line.indexOf(':') > -1)
    .reduce(
      (prev, next) => {
        const [, varName, color] = next.match(/(?=\S*['-])([@a-zA-Z0-9'-]+).*:[ ]{1,}(.*);/);
        prev.cTn[color] = varName;
        prev.nTc[varName] = color;

        return prev;
      },
      { cTn: {}, nTc: {} }
    );
  content = defaultLessColors;
  const mappings = content
    .split('\n')
    .filter(line => line.startsWith('@') && line.indexOf(':') > -1)
    .reduce(
      (prev, next) => {
        try {
          let [, varName, color] = next.match(/(?=\S*['-])([@a-zA-Z0-9'-]+).*:[ ]{1,}(.*);/);
          if (varName in variables || varName.includes('@primary')) {
            if (color in colors.nTc) color = colors.nTc[color];
            color = color.startsWith('@') ? prev.nTc[color] || color : color;
            if (color in prev.cTn) return prev;
            prev.cTn[color] = varName;
            prev.nTc[varName] = color;
            return prev;
          }
          return prev;
        } catch (e) {
          console.log('e', e);
          return prev;
        }
      },
      { cTn: {}, nTc: {} }
    );
  return mappings;
}

function replacePrimaryColors() {
  const mappings = generateColorMappings();
  let css = `${defaultLessColors}\n${scripts}`;
  const varNames = Object.keys(themeVars);
  varNames.forEach(varName => {
    const color = mappings.nTc[varName] || themeVars[varName];
    console.log(varName, color);
    if (
      isValidColor(color) ||
      color.includes('@{primary-color}') ||
      color.includes('fade(')
    ) {
      css = `.${varName.replace('@', '')} { color: ${color}; }\n ${css}`;
    }
  });

  varNames.forEach(varName => {
    css = `${varName}: ${mappings.nTc[varName]};\n${css}`;
  });
  Object.keys(mappings.nTc).forEach(varName => {
    if (varName !== '@primary-color' && varName.includes('@primary-')) {
      // e.g. varName = '@primary-1', color = 'color(~`colorPalette("@{primary-color}", 1)`)'
      const color = mappings.nTc[varName];
      if (color.includes('@{primary-color}')) {
        delete mappings.cTn[color];
        mappings.cTn[varName] = color;
        css = `.${varName.replace('@', '')} { color: ${color}; }\n ${css}`;
      }
    }
  });
  css = `${scripts}\n@primary-color: ${
    mappings.nTc['@primary-color']
  };\n${css}`;
  return render(css)
    .then(({ css }) => {
      console.log(css);
      css = css.replace(/(\/.*\/)/g, '');
      const regex = /.(?=\S*['-])([.a-zA-Z0-9'-]+)\ {\n\ \ color:\ (.*);/g;
      const vars = getMatches(css, regex);
      const classes = Object.keys(vars);
      classes.forEach(cls => {
        if (cls.match(/primary-\d\d?/)) {
          const colorName = mappings.cTn[cls];
          /* here colorName will be like 'color(~`colorPalette("@{primary-color}", 1)`)'
           So we will delete colorToNames 'cTn' mappings entry for
           {
             '@primary-1': 'color(~`colorPalette("@{primary-color}", 1)`)'
           }
           and will replace with
           {
             '#e6f7ff': 'color(~`colorPalette("@{primary-color}", 1)`)' // some color code
           }
        */
          delete mappings.cTn[cls];
          mappings.cTn[vars[cls]] = colorName;
        } else {
          mappings.cTn[vars[cls]] = cls;
        }
      });
      return mappings;
    })
    .catch(error => {
      console.log('Error color extraction', error);
    });
}

function getMatches(string, regex) {
  const matches = {};
  let match;
  while ((match = regex.exec(string))) {
    if (match[2].startsWith('rgba') || match[2].startsWith('#')) {
      matches[`@${match[1]}`] = match[2];
    }
  }
  return matches;
}

function render(text) {
  return less.render.call(less, text, {
    paths: [
      path.join(antd, 'lib/styles'),
      path.join(antd, 'lib/style'),
      path.join(antd, 'lib/style/themes'),
      path.join(__dirname, 'src/styles')
    ],
    javascriptEnabled: true
  });
}

function getLessVars(filtPath) {
  const sheet = fs.readFileSync(filtPath).toString();
  const lessVars = {};
  const matches = sheet.match(/@(.*:[^;]*)/g) || [];

  matches.forEach(variable => {
    const definition = variable.split(/:\s*/);
    const varName = definition[0].replace(/['"]+/g, '').trim();
    lessVars[varName] = definition.splice(1).join(':');
  });
  return lessVars;
}

function isValidColor(color) {
  if (color.charAt(0) === '#') {
    color = color.substring(1);
    return (
      [3, 4, 6, 8].indexOf(color.length) > -1 && !isNaN(parseInt(color, 16))
    );
  }
  return /^(rgb|hsl)a?\((\d+%?(deg|rad|grad|turn)?[,\s]+){2,3}[\s\/]*[\d\.]+%?\)$/i.test(color);
}

module.exports = { getLessVars };
