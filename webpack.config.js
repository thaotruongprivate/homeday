const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: "./assets/js/github.js",
    output: {
        path: path.resolve(__dirname, 'public/build'),
        filename: "github.js",
        publicPath: '/build/'
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',

                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash:6].[ext]'
                        }
                    }
                ]
            }
        ]
    },
};