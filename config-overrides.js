/* eslint-disable */

const path = require('path')
const { override, addWebpackAlias, addBundleVisualizer, addWebpackExternals } = require('customize-cra')

const isProd = process.env.NODE_ENV === "production"

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),

  isProd && addBundleVisualizer(),
  isProd && addWebpackExternals({
    'react': 'React',
    'react-dom': 'ReactDOM',
    'antd': 'antd'
  }),
)
