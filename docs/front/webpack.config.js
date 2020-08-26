const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
const fs = require('fs');
const path = require("path");
const rimraf = require("rimraf");
const _ = require("lodash");
const appChunks = {};
const appEntries = {};


fs.readdirSync(path.join(__dirname, 'apps')).forEach(function (file) {
    appChunks[file] = {
        test: new RegExp(`[\\/]apps[\\/]${file}[\\/]`),
        // priority: 0,
        name: file
    }
    appEntries[file] = path.resolve(__dirname, 'apps', file, 'index.js')
});


const cleanNodeModules = () => rimraf(path.resolve(__dirname, 'node_modules'), function () { console.log(path.resolve(__dirname, 'node_modules') + " cleared"); });
cleanNodeModules();
const resolve = rpath => path.resolve(path.join(__dirname, rpath))

module.exports = env => {

    env = process.env = { ...(process.env || {}), ...(env || {}) };
    const publicPath = _.trimEnd(env.FRONT_PATH || '', '/') + '/'
    API = {}
    _.map(env, (value, name) => {
        _.endsWith(name, '_API') && (API[name] = JSON.stringify(value))
    })
    const DEFINES = {
        VERSION: JSON.stringify(env.npm_package_version),
        FRONT_PATH: JSON.stringify(publicPath),
        APPS_PATH: JSON.stringify(resolve('apps')),
        DEV_MODE: JSON.stringify(env.DEV_MODE),
        ...(API)
    }
    console.log(DEFINES)
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
        API: [resolve('etc/API'), 'default'],
        APP: [resolve('etc/APP'), 'default'],
        COOKIE: [resolve('etc/COOKIE'), 'default'],
        Model: [resolve('libs/Models/Model'), 'default'],
    }
    const settings = {
        entry: {
            index: path.resolve(__dirname, 'src/index.js'),
            // ...appEntries
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
            // new webpack.HashedModuleIdsPlugin(),
            new webpack.DefinePlugin(DEFINES),
            new webpack.ProvidePlugin(PROVIDES),
            new CleanWebpackPlugin(),
            new HtmlWebPackPlugin({
                template: path.join(__dirname, 'src/index.html'),
                filename: 'index.html',
                // hash: true
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
                // maxInitialRequests: Infinity,
                // minSize: 0,
                cacheGroups: {
                    etc: {
                        test: /[\\/]etc[\\/]/,
                        name: 'etc',
                        priority: -5,
                    },
                    libs: {
                        test: /[\\/]libs[\\/]/,
                        name: 'libs',
                    },
                    mui: {
                        test: /[\\/]node_modules\/\@material-ui[\\/]/,
                        name: 'mui',
                        priority: -5,
                    },
                    mathjs: {
                        test: /[\\/]node_modules\/mathjs[\\/]/,
                        name: 'mathjs',
                        priority: -5,
                    },
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        priority: -10,
                    },
                    ...appChunks
                },
            },
            //   minimizer: [new TerserPlugin({
            //     include: /\.min\.js$/,
            //     sourceMap: true,
            //     terserOptions: {}
            //   })],
        },
        // devtool: '#cheap-source-map',
        ...(env.DEV_MODE ? {
            // devtool: 'eval', // fastest fastest
            // devtool: 'eval-cheap-source-map', // fast fastest
            devtool: '#eval-source-map',
            // devtool: 'inline-source-map',
            devServer: {
                contentBase: './<%= pkg.src %>/',
                publicPath: publicPath,
                compress: true,
                // noInfo: true,
                disableHostCheck: true,
                historyApiFallback: true,
                port: 8000,
                host: '0.0.0.0',
                sockPort: env.SOCK_PORT,
                hot: true,
                // hot: false, 
                // after: function (app, server, compiler) {
                //     // cleanNodeModules();
                //     // do fancy stuff
                // }
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
                            // cacheDirectory: true,
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
                    loader: ["file-loader"] //?name=./images/[name].[ext]" 
                },
                {
                    test: /\.css$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: ['style-loader', 'css-loader'],
                },
                // {
                //     test: /\.scss$/,
                //     use: [styleLoader, cssLoader(true), postcssLoader, 'sass-loader'],
                //     // use: ['style-loader', 'sass-loader'],
                //     exclude: /(node_modules)/,
                // },
            ]
        }
    };
    return settings;
};
