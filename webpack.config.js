const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    // the entry file for the bundle
    entry: path.join(__dirname, '/client/src/app.jsx'),

    // the bundle file we will get in the result
    output: {
        path: path.join(__dirname, '/client/dist/js'),
        filename: 'app.js',
        publicPath: '/'
    },
    node: {
        fs: "empty"
    },
    module: {

        // apply loaders to files that meet given conditions
        loaders: [{
            test: /\.jsx?$/,
            include: path.join(__dirname, '/client/src'),
            loader: 'babel-loader',
            query: {
                presets: ["react", "es2015"]
            }
        },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader'
            },
            {
                test: /\.(jpg|png|gif|svg|pdf|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name]-[hash:8].[ext]'
                        },
                    },
                ]
            }

        ],
    },
    devServer: {
        contentBase: path.join(__dirname, "public"),
        watchContentBase: true,
        publicPath: "/",
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/static/index.html'
        })
    ],
    // start Webpack in a watch mode, so Webpack will rebuild the bundle on changes
    watch: true
};