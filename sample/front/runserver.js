const express = require('express');
const webpack = require('webpack');
const path = require("path");
const fs = require('fs');
const _ = require("lodash");
const webpackDevMiddleware = require('webpack-dev-middleware');
const resolve = rpath => path.resolve(path.join(__dirname, rpath))
const history = require('connect-history-api-fallback');

const app = express();
app.use(require('morgan')('short'));
require('console-stamp')(console, "HH:MM:ss.l");

const config = require('./webpack.config')({ ...process.env, DEV_MODE: 1 });
const hmrPublicPath = `${config.output.publicPath}__webpack_hmr`
config.mode = 'development'
config.plugins.push(new webpack.HotModuleReplacementPlugin())
config.watchOptions = {
    poll: true,
    ignored: /[\\/]node_modules[\\/]/
}
config.entry = _.concat([
    `webpack-hot-middleware/client?path=${hmrPublicPath}&timeout=20000`,
], config.entry)
// VERY TEMP
dev_channels_binding = resolve('../tmp/channels-binding-core')
console.log(dev_channels_binding, fs.existsSync(dev_channels_binding))
if (fs.existsSync(dev_channels_binding)) {
    config.resolve.alias["@channels-binding/core"] = dev_channels_binding
}
// VERY TEMP
const compiler = webpack(config);

// app.use((req, res, next) => {
//     console.log(req.url, !/(\.\w+$|__webpack.*)/.test(req.url))
//     if (!/(\.\w+$|__webpack.*)/.test(req.url)) {
//         req.url = config.output.publicPath;
//         next()
//     }
// });

// app.use(history());
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    // contentBase: './<%= pkg.src %>/',
    compress: true,
    noInfo: true,
    stats: {
        colors: true
    },
    disableHostCheck: true,
    historyApiFallback: {
        index: config.output.publicPath
    },
    port: 8000,
    host: '0.0.0.0',
    sockPort: process.env.PORT,
    sockPath: config.output.publicPath + 'sockjs-node',
    hot: true,
    // after: function (app, server, compiler) {
    //     // cleanNodeModules();
    //     // do fancy stuff
    // }
}));

app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log,
    path: `${hmrPublicPath}`,
    heartbeat: 10 * 1000
}));

app.use('*', (req, res, next) => {
    const filename = path.resolve(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
        if (err) {
            return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    });
});
// app.get(`${config.output.publicPath}`, function (req, res) {
//     console.log(config.output.publicPath, config.output.path)
//     res.sendFile(config.output.path + '/index.html');
// });

app.listen(8000, function () {
    console.log('Example app listening\n');
});