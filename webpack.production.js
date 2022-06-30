const HtmlWebpackPlugin = require("html-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { merge } = require("webpack-merge");
const base = require("./webpack.config");
const path = require("path");

module.exports = merge(base, {
  mode: "production",
  devtool: "source-map",
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "app/src/index.html"),
      filename: "index.html",
      base: "app://rse"
    }),
    // You can paste your CSP in this website https://csp-evaluator.withgoogle.com/
    // for it to give you suggestions on how strong your CSP is
    new CspHtmlWebpackPlugin({
      "base-uri": ["'self'"],
      "default-src": ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
      "connect-src": ["'self'", "https://o100308.ingest.sentry.io", "http://localhost:8888"],
      "object-src": ["'none'"],
      "script-src": ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
      "style-src": ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
      "frame-src": ["'none'"],
      "worker-src": ["'none'"]
    }, {
      enabled: true,
      hashingMethod: "sha256",
      hashEnabled: {
        "script-src": true,
        "style-src": true
      },
      nonceEnabled: {
        "script-src": true,
        "style-src": true
      }
      // processFn: defaultProcessFn  // defined in the plugin itself
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      "...", // This adds default minimizers to webpack. For JS, Terser is used. // https://webpack.js.org/configuration/optimization/#optimizationminimizer
      new CssMinimizerPlugin()
    ]
  }
});
