const webpack = require('webpack')
module.exports = (config) => {
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      h: ['preact', 'h'],
    }),
  ]
  config.resolve.alias = {
    ...config.resolve.alias,
    react: 'preact/compat',
    'react-dom/test-utils': 'preact/test-utils',
    'react-dom': 'preact/compat',
  }
  return config
}
