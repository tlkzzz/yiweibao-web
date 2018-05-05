var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
    env : process.env.NODE_ENV || 'development',
}

config.globals = {
    'process.env'  : {
        'NODE_ENV' : JSON.stringify(config.env)
    },
    'NODE_ENV'     : config.env,
    '__DEV__'      : config.env === 'development',
    '__PROD__'     : config.env === 'production'
}

var __DEV__ = config.globals.__DEV__,
    __PROD__ = config.globals.__PROD__;

var webpackConfig = {};
var entryVendorArr = [
    'react',
    'react-dom',
    'redux',
    'react-redux',
    'react-router',
    'es6-promise',
    'isomorphic-fetch',
    'react-addons',
]

if (__DEV__) {
    entryVendorArr = entryVendorArr.concat([
        'react-intl',
        'moment',
        'antd'
    ]);
}

webpackConfig.entry =  {
    app: './src/containers/index.jsx',
    vendor: entryVendorArr
};
webpackConfig.output = {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].[chunkhash:5].js',
    publicPath: "/",
    chunkFilename: 'js/[name].[chunkhash:5].chunk.js',
}
webpackConfig.module = {
    rules: [
        {
            test: /\.js[x]?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    // cacheDirectory : true,
                    plugins        : ['transform-runtime'],
                    presets        : ['es2015', 'react', 'stage-0']
                }
            }
        },
        {
            test: /\.html$/,
            use: ['html-loader']
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                 })
        },
        {
            test: /\.(pdf.*|eot.*|woff.*|woff2.*|ttf.*|svg.*|png.*|jpg.*|gif.*)$/,
            use: ['file-loader?limit=10000&name=images/[name].[hash:5].[ext]']
        }

    ],

};

var vendorArr = ['vendor'];

if (__DEV__) vendorArr.push('manifest');

webpackConfig.plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        names: vendorArr
    }),
    // new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin({
        filename: 'css/[name].[chunkhash:5].css',
        allChunks: true,
    }),
    new webpack.DefinePlugin(config.globals),
    new HtmlWebpackPlugin({
        favicon:'./src/images/favicon.ico',
        filename: 'index.html',
        template: './src/index.html',
        inject: true
    })
];

webpackConfig.resolve = {
    extensions: ['.js','.json']
};

if (__DEV__) {
    webpackConfig.devtool = 'eval-source-map';
    webpackConfig.devServer = {
        disableHostCheck: true,
        historyApiFallback: true,
        contentBase: "./dist",
        hot: false,
        inline: true,
        port: 9092,
        proxy: {
            '/signin': { //本地请求地址加/signin =>  //car.nymph.cc:8080/signin'
                changeOrigin: true,
                target: 'http://192.168.1.246:9002',
                pathRewrite: {'^/signin': ''}
            },
            '/api': { //跨多个域
                changeOrigin: true,
                target: 'http://192.168.1.246:9000',
                pathRewrite: {'^/api': ''}
            }
        }
    }
}
else if (__PROD__) {
    console.log('__PROD__ environment')
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true,
            mangle: true
        })
    )
}

module.exports = webpackConfig;
