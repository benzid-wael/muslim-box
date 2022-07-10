const HtmlWebpackPlugin = require("html-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const base = require("./webpack.config");
const path = require("path");

module.exports = merge(base, {
  mode: "development",
  devtool: "source-map", // Show the source map so we can debug when developing locally
  devServer: {
    host: "localhost",
    port: "40992",
    hot: true, // Hot-reload this server if changes are detected
    compress: true, // Compress (gzip) files that are servedhotOnly: true,
    // headers: {
    //   "Content-Security-Policy": "default-src 'self'; base-href 'self';"
    // },
    static: {
      directory: path.resolve(__dirname, "app/dist"), // Where we serve the local dev server's files from
      watch: true, // Watch the directory for changes
      staticOptions: {
        ignored: /node_modules/ // Ignore this path, probably not needed since we define directory above
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "app/src/index.html"),
      filename: "index.html"
    }),
    new CspHtmlWebpackPlugin({
      "base-uri": ["'self'"],
      "default-src": ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
      "connect-src": ["'self'", "o100308.ingest.sentry.io", "localhost:3001"],
      "object-src": ["'none'"],
      "script-src": ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
      "style-src": ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
      "img-src": ["'unsafe-inline'", "'self'", "'unsafe-eval'", "data:", "localhost:3001"],
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
  ]
})
