const webpack = require('webpack');

module.exports = {
    webpack: {
        plugins: {
            add: [
                // new webpack.ProvidePlugin({
                //     process: 'process/browser.js',
                // })
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                }),
                new webpack.ProvidePlugin({
                    process: 'process/browser',
                }),
            ]
        },
        configure: {
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        resolve: {
                            fullySpecified: false,
                        },
                    },
                ],
            },
        },
    },
};