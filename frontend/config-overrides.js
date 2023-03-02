const { useBabelRc, override, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  useBabelRc(),
  addWebpackAlias({
    ['@assets']: path.resolve(__dirname, './src/assets'),
    ['@core']: path.resolve(__dirname, './src/modules/Core'),
    ['@fire']: path.resolve(__dirname, './src/firebase'),
    ['@auth']: path.resolve(__dirname, './src/auth'),
    ['@context']: path.resolve(__dirname, './src/context'),
    ['Home']: path.resolve(__dirname, './src/modules/Home'),
    ['AdminHome']: path.resolve(__dirname, './src/modules/AdminHome'),
    ['EditZing']: path.resolve(__dirname, './src/modules/EditZing'),
    ['Login']: path.resolve(__dirname, './src/modules/Login'),
    ['Signup']: path.resolve(__dirname, './src/modules/Signup'),
    ['Survey']: path.resolve(__dirname, './src/modules/Survey'),
    ['CreateZing']: path.resolve(__dirname, './src/modules/CreateZing'),
    ['Dashboard']: path.resolve(__dirname, './src/modules/Dashboard'),
    ['Emailing']: path.resolve(__dirname, './src/modules/Emailing'),
    ['TemplateEditor']: path.resolve(__dirname, './src/modules/TemplateEditor'),
  })
)
