const { useBabelRc, override, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  useBabelRc(),
  addWebpackAlias({
    ['@assets']: path.resolve(__dirname, './src/assets'),
    ['@core']: path.resolve(__dirname, './src/modules/Core'),
    ['Home']: path.resolve(__dirname, './src/modules/Home'),
    ['EditZing']: path.resolve(__dirname, './src/modules/EditZing'),
    ['Login']: path.resolve(__dirname, './src/modules/Login'),
    ['Signup']: path.resolve(__dirname, './src/modules/Signup'),
    ['Survey']: path.resolve(__dirname, './src/modules/Survey'),
    ['CreateZing']: path.resolve(__dirname, './src/modules/CreateZing'),
    ['Dashboard']: path.resolve(__dirname, './src/modules/Dashboard'),
  })
)
