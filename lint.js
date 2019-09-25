// Run eslint from Node for debugging
const CLIEngine = require('eslint').CLIEngine

const lodashToNativePlugin = require('./lib')

const cli = new CLIEngine({
  envs: ['es6'],
  plugins: ['eslint-plugin-lodash-to-native'],
  useEslintrc: false,
  rules: {
    'indent': ["error", 2],
    'lodash-to-native/map': 2,
  }
})
cli.addPlugin('eslint-plugin-lodash-to-native', lodashToNativePlugin)
cli.executeOnFiles(['app/index.js'])
