const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');
const path = require("path");
const rimraf = require("rimraf");
const _ = require("lodash");

const cleanNodeModules = () => rimraf(path.resolve(__dirname, 'node_modules'), function () { console.log(path.resolve(__dirname, 'node_modules') + " cleared"); });
cleanNodeModules();
const resolve = rpath => path.resolve(path.join(__dirname, rpath))

module.exports = env => {

    env = process.env = { ...(process.env || {}), ...(env || {}) };
    const publicPath = _.trimEnd(env.FRONT_PATH || '', '/') + '/'
    const DEFINES = {
        VERSION: JSON.stringify(env.npm_package_version),
        FRONT_PATH: JSON.stringify(publicPath),
        DEV_MODE: JSON.stringify(env.DEV_MODE),
        ...(API)
    }
    const PROVIDES = {
        _: 'lodash',
        React: 'react',
        key: 'weak-key',
        moment: 'moment',
        clsx: ['clsx', 'default'],
        withStyles: ['@material-ui/core/styles', 'withStyles'],
        makeStyles: ['@material-ui/core/styles', 'makeStyles'],
        slugify: ['slugify'],
        observable: ['mobx', 'observable'],
        action: ['mobx', 'action'],
        computed: ['mobx', 'computed'],
        observe: ['mobx', 'observe'],
        deepObserve: ['mobx-utils', 'deepObserve'],
        toJS: ['mobx', 'toJS'],
        observer: ['mobx-react', 'observer'],
        Observer: ['mobx-react', 'Observer'],
        COOKIE: [resolve('etc/COOKIE'), 'default'],
    }
    const settings = {
        entry: {
            index: path.resolve(__dirname, 'src/index.js'),
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[hash].js',
            publicPath: publicPath,
        },
        resolve: {
            alias: {
                "@channels-binding/core": path.resolve(__dirname, '../../packages/channels-binding-core/src'),
                "@channels-binding/mui": path.resolve(__dirname, '../../packages/channels-binding-mui/src'),
            }
        },
        plugins: [
            new webpack.DefinePlugin(DEFINES),
            new webpack.ProvidePlugin(PROVIDES),
            new CleanWebpackPlugin(),
            new HtmlWebPackPlugin({
                template: path.join(__dirname, 'src/index.html'),
                filename: 'index.html',
            }),
            ...(env.DEV_MODE ? [
                new webpack.HotModuleReplacementPlugin(),
            ] : []),
            {
                apply: (compiler) => {
                    compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                        cleanNodeModules();
                    });
                }
            }
        ],
        optimization: {
            moduleIds: 'hashed',
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    etc: {
                        test: /[\\/]src[\\/]/,
                        name: 'src',
                        priority: -5,
                    },
                    mui: {
                        test: /[\\/]node_modules\/\@material-ui[\\/]/,
                        name: 'mui',
                        priority: -5,
                    },
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        priority: -10,
                    },
                },
            },
        },
        ...(env.DEV_MODE ? {
            // devtool: 'eval', // fastest fastest
            // devtool: 'eval-cheap-source-map', // fast fastest
            devtool: '#eval-source-map',
            // devtool: 'inline-source-map',
            devServer: {
                contentBase: './<%= pkg.src %>/',
                publicPath: publicPath,
                compress: true,
                disableHostCheck: true,
                historyApiFallback: true,
                port: 8000,
                host: '0.0.0.0',
                sockPort: env.SOCK_PORT,
                hot: true,
            },
            watchOptions: {
                poll: true,
                ignored: /[\\/]node_modules[\\/]/
            },
        } : {


            }),
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: [{
                        loader: "babel-loader",
                        options: {
                            retainLines: true,
                            presets: ['@babel/preset-env', "@babel/preset-react"],
                            plugins: [
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                ["@babel/plugin-proposal-class-properties", { "loose": true }],
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
                    test: /\.(jpe?g|gif|png|svg)$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    loader: ["file-loader"] 
                },
                {
                    test: /\.css$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: ['style-loader', 'css-loader'],
                },
            ]
        }
    };
    return settings;
};
