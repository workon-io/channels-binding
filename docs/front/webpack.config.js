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
        key: 'weak-key',
        moment: 'moment',
        clsx: ['clsx', 'default'],
        withStyles: ['@material-ui/core/styles', 'withStyles'],
        makeStyles: ['@material-ui/core/styles', 'makeStyles'],
        slugify: ['slugify'],
        observable: ['mobx', 'observable'],
        action: ['mobx', 'action'],
        computed: ['mobx', 'computed'],
        // intercept: ['mobx', 'intercept'],
        // observe: ['mobx', 'observe'],
        deepObserve: ['mobx-utils', 'deepObserve'],
        toJS: ['mobx', 'toJS'],
        observer: ['mobx-react', 'observer'],
        Observer: ['mobx-react', 'Observer'],
        Chart: ['react-apexcharts', 'default'],
        Link: ['react-router-dom', 'Link'],
        Route: ['react-router-dom', 'Route'],
        Bind: ['@channels-binding/core', 'Bind'],
        Retrieve: ['@channels-binding/core', 'Retrieve'],
        Search: ['@channels-binding/core', 'Search'],

        // Uses
        useBind: ['@channels-binding/core', 'useBind'],
        usePassiveBind: ['@channels-binding/core', 'usePassiveBind'],
        useRetrieve: ['@channels-binding/core', 'useRetrieve'],
        useSearch: ['@channels-binding/core', 'useSearch'],
        useForm: ['@channels-binding/core', 'useForm'],
        useConsumer: ['@channels-binding/core', 'useConsumer'],
        useParams: ['react-router-dom', 'useParams'],
        useHistory: ['react-router-dom', 'useHistory'],
        useDebouncedState: ['@channels-binding/core', 'useDebouncedState'],

        // Local

        Code: ['libs/Code', 'default'],


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
                template: resolve('src/index.html'),
                favicon: resolve("src/Icon.svg"),
                filename: 'index.html',
                // inject: false
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
                            // cacheDirectory: true,
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
                                // [
                                //     'babel-plugin-import',
                                //     {
                                //         'libraryName': '@material-ui/core',
                                //         // Use "'libraryDirectory': ''," if your bundler does not support ES modules
                                //         'libraryDirectory': 'esm',
                                //         'camel2DashComponentName': false
                                //     },
                                //     'core'
                                // ],
                                // [
                                //     'babel-plugin-import',
                                //     {
                                //         'libraryName': '@material-ui/icons',
                                //         // Use "'libraryDirectory': ''," if your bundler does not support ES modules
                                //         'libraryDirectory': 'esm',
                                //         'camel2DashComponentName': false
                                //     },
                                //     'icons'
                                // ]
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
            // splitChunks: {
            //     chunks: 'all',
            //     cacheGroups: {
            //         src: {
            //             test: /[\\/]src[\\/]/,
            //             name: 'src',
            //         },
            //         libs: {
            //             test: /[\\/]libs[\\/]/,
            //             name: 'libs',
            //         },
            //         mui: {
            //             test: /[\\/]node_modules\/\@material-ui[\\/]/,
            //             name: 'mui',
            //             priority: -5,
            //         },
            //         vendors: {
            //             test: /[\\/]node_modules[\\/]/,
            //             name: 'vendors',
            //             priority: -10,
            //         }
            //     },
            // },
        },
    };
    return settings;
};
