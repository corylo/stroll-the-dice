const webpack = require("webpack"),
  path = require("path");

const CopyPlugin = require("copy-webpack-plugin"),
  HtmlPlugin = require("html-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin");
  
const { GenerateSW } = require("workbox-webpack-plugin");

const config = {
  entry: "./stroll-client/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new HtmlPlugin({
      template: path.resolve(__dirname, "stroll-client/index.html"),
      filename: "index.html",
      favicon: "stroll-client/img/favicon.svg"
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "stroll-client/img",
          to: "img"
        },
        {
          from: "stroll-client/googleb8708be99dfba801.html",
          to: "googleb8708be99dfba801.html"
        },
        {
          from: "stroll-client/manifest.json",
          to: "manifest.json"
        }
      ],
    })
  ]
}

if(process.env.NODE_ENV === "local") {
  config.output = {
    filename: "index.[fullhash].js",
    path: path.resolve(__dirname, ""),
    publicPath: "/"
  }

  config.module.rules.push({
    test: /\.scss$/,
    use: [
      { loader: "style-loader" },
      { loader: "css-loader" },
      { loader: "sass-loader" }
    ],
  });

  config.devServer = {
    port: 3001,
    historyApiFallback: true
  };
} else if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "development"
) {
  if (process.env.NODE_ENV === "development") {
    config.plugins.push(new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }));
  } else if (process.env.NODE_ENV === "production") {
    config.plugins.push(new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }));
  }

  config.output = {
    filename: "index.[fullhash].js",
    path: path.resolve(__dirname, "public"),
    publicPath: "/",
  };

  config.module.rules.push({
    test: /\.scss$/,
    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
  });

  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: "index.[fullhash].css",
    })
  );

  config.plugins.push(new GenerateSW());
}

module.exports = config;