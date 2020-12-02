const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
const fs = require('fs');
const path = require("path");
const rimraf = require("rimraf");
const _ = require("lodash");

const cleanNodeModules = () => rimraf(path.resolve(__dirname, 'node_modules'), function () { console.log(path.resolve(__dirname, 'node_modules') + " cleared"); });
cleanNodeModules();
const resolve = rpath => path.resolve(path.join(__dirname, rpath))


module.exports = env => {

    env = process.env = { ...(process.env || {}), ...(env || {}) };
    const publicPath = _.trimEnd(_.trim(env.PUBLIC_PATH || '', '"'), '/') + '/'
    const publicWsPath = _.trimEnd(_.trim(env.PUBLIC_WS_PATH || '', '"'), '/') + '/'
    const debug = _.parseInt(env.DEBUG || 0)

    const DEFINES = {
        VERSION: JSON.stringify(env.npm_package_version),
        DEBUG: JSON.stringify(debug),
        PORT: JSON.stringify(env.PORT),
        PUBLIC_PATH: JSON.stringify(publicPath),
        PUBLIC_WS_PATH: JSON.stringify(publicWsPath),
        DEV_MODE: JSON.stringify(env.DEV_MODE),
    }
    const PROVIDES = {
        // Thrid Party
        _: 'lodash',
        React: 'react',
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
    }
    const ALIASES = {
        assets: resolve('assets/'),
        libs: resolve('libs/'),
        back: path.resolve("/back/"),
        src: resolve('src/'),
        zlib: require.resolve("browserify-zlib"),
    }
    const settings = {

        entry: resolve('src/index.js'),

        output: {
            path: resolve('dist'),
            // filename: '[name].bundle.js',
            filename: '[name].[contenthash].js',
            publicPath: publicPath,
        },

        resolve: {
            alias: ALIASES,
            fallback: {
                zlib: require.resolve("browserify-zlib"),
            },
        },

        plugins: [
            new webpack.DefinePlugin(DEFINES),
            new CleanWebpackPlugin(),
            new HtmlWebPackPlugin({
                template: path.join(__dirname, 'src/index.html'),
                filename: 'index.html',
            }),
            new webpack.ProvidePlugin(PROVIDES),
            {
                apply: compiler => compiler.hooks.afterEmit.tap('AfterEmitPlugin', cleanNodeModules)
            }
        ],

        module: {
            rules: [
                {
                    test: /\.m?js/,
                    resolve: {
                        fullySpecified: false,
                    },
                },
                {
                    test: /\.jsx?$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    resolve: {
                        fullySpecified: false
                    },
                    type: "javascript/auto",
                    use: [{
                        loader: "babel-loader",
                        options: {
                            retainLines: true,
                            presets: ['@babel/preset-env', "@babel/preset-react"],
                            plugins: [
                                [
                                    "@babel/plugin-proposal-decorators",
                                    {
                                        "legacy": true
                                    }
                                ],
                                [
                                    "@babel/plugin-proposal-class-properties",
                                    {
                                        "loose": true
                                    }
                                ],
                            ],
                        }
                    }],
                },
                {
                    test: /\.html$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: ["html-loader"],
                },
                {
                    test: /\.[\w]+?raw$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: ["raw-loader"] //?name=./images/[name].[ext]" 
                },
                {
                    test: /\.(jpe?g|gif|png|svg)$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: ["file-loader"] //?name=./images/[name].[ext]" 
                },
                {
                    test: /\.css$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: ['style-loader', 'css-loader'],
                },
            ]
        },

        optimization: {
            moduleIds: 'deterministic',
            runtimeChunk: 'single',
        },
    };
    return settings;
};
