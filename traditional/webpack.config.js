const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 临时chunks数组，用于同输出前后chunks作比对，找出变更的js模块，初始为空
const namedChunksTemp = [];
const HelloWorldPlugin = require('./HelloWorldPlugin');

module.exports = {
    entry: {
        // 'vendor': [
        //     'promise-polyfill'
        //     // 'babel-polyfill'
        // ],
        'index': './app/index/index'
    },
    output: {
        path: path.resolve(__dirname, 'public'),

        // 按需加载模块的文件路径
        // 如：https://cdn.example.com/assets/
        publicPath: '/',

        // 入口模块命名
        //这里分别用hash和chunkhash，结果不一样
        // filename: 'javascripts/[name]-[hash].js',
        filename: 'javascripts/[name]-[chunkhash].js',

        // 分片模块（非入口模块）命名
        // 其中，chunkName由require.ensure()的第三个参数指定
        // require.ensure(dependencies: String[], callback: function(require), chunkName: String)
        // 若未指定第三个参数，则默认的chunkName为模 块id（自动生成）
        chunkFilename: 'javascripts/[name]-[chunkhash].chunk.js'
    },
    // 观察模式
    // 监测代码，并在代码改变的时候进行重新编译
    watch: true,
    watchOptions: {
        // 当代码首次被改变后增加一个时间延迟
        // 如果在这段延迟时间内，又有其他代码发生了改变，
        // 则其他的改变也将在这段延迟时间后，一并进行编译
        aggregateTimeout: 500,

        // 不进行监测的文件
        // 监测大量的文件将占用CPU或许多内存空间，例如node_modules
        ignored: /node_modules/,

        // 每隔一段时间，自动检查代码的改变，例如1000表示每秒进行一次检查
        // 在观察模式不起作用的时候，可以尝试打开这个配置项
        poll: 1000
    },
    /**
     * 解析
     */
    resolve: {
        // 给路径添加别名，可有效避免模块中require的路径过长
        alias: {
            // app: path.resolve(__dirname, BASE_PATH),
            // js: path.resolve(__dirname, './src/public/assets/js'),
            components: path.resolve(__dirname, './public/components')
        }
    },
    // 各种编译loaders
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }, {
                    loader: 'es3ify-loader'
                }]
            },
            {
                test: /\.pug$/,
                use: 'pug-loader'
            }
        ]
    },
    // 插件
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "vendor",
        //     // filename: "vendor.js"
        //     // (Give the chunk a different name)

        //     minChunks: Infinity,
        //     // (with more entries, this ensures that no other module
        //     //  goes into the vendor chunk)
        // }),
        /**
         * To extract the webpack bootstrap logic into a separate file, use the CommonsChunkPlugin on a name which is not defined as entry.
         * Commonly the name manifest is used. See the caching guide for details.
         * 
         * https://webpack.js.org/plugins/commons-chunk-plugin/#manifest-file
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),
        new webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20
        }),
        // new webpack.ProvidePlugin({
        //     Promise: 'promise-polyfill'
        // }),
        // new UglifyJsPlugin({
        //     uglifyOptions: {
        //         ie8: true,
        //     },
        // })
        // new HtmlWebpackPlugin({
        //     template: 'pug!views/index.pug',
        //     filename: 'index.pug',
        //     minify: false
        //     // inject: 'body'
        // })
        new HelloWorldPlugin({
            namedChunksTemp: namedChunksTemp
        })
    ],
    // stats: { //object
    //     // assets: true,
    //     // colors: true,
    //     // errors: true,
    //     // errorDetails: true,
    //     hash: true,
    //     // ...
    // }
};