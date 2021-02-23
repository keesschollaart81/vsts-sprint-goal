var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var path = require('path');
module.exports = {
  mode: 'development',
  entry: {
    SprintGoalApplicationInsightsWrapper: './dist/js/SprintGoalApplicationInsightsWrapper.js',
    SprintGoal: './dist/js/sprint-goal.js',
    SprintGoalWidget: './dist/js/widget.js',
    SprintGoalWidgetConfiguration: './dist/js/widgetconfig.js',
    SprintGoalAdmin: './dist/js/SprintGoalAdmin.js'
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist', 'sprint-goal'),
    filename: '[name].js',
    libraryTarget: "amd"
  },
  externals: [
    {
    },
    /^VSS\/.*/, /^TFS\/.*/, /^q$/
  ],
  plugins: [
    new CopyWebpackPlugin({
      patterns:[
      { from: "./node_modules/moment/min/moment.min.js", to: "moment.js" },
      { from: "./node_modules/jscolor-picker/jscolor.min.js", to: "jscolor.min.js" },
      { from: "./node_modules/vss-web-extension-sdk/lib/VSS.SDK.min.js", to: "VSS.SDK.js" },
      { from: './static', to: path.resolve(__dirname, 'dist', 'widget') }
    ]})
  ],
  resolve: {
    extensions: ['.js', '.css', '.scss'],
    alias: {
      "moment": "moment/min/moment.min.js"
    }
  }
};