module.exports = [
  ['use-babel-config', '.babelrc'],
  ['use-eslint-config', '.eslintrc'],
  config => {
    const newConfig = config;

    let rule = newConfig.module.rules.find(rule => rule.oneOf);

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
            modifyVars: { '@primary-color': '#1DA57A' }
          }
        }
      ]
    });

    return newConfig;
  }
];
