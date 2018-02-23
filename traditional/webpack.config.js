const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
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
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            },
            {
                test: /\.pug$/,
                use: 'pug-loader'
            }
        ]
    },
    // 插件
    plugins: [
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
        })
    ]
};