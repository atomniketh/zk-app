Does this allow me to turn a long string >32 chars to a UINT256?
        uint256 zeroValue = uint256(keccak256(abi.encodePacked(groupId))) >> 8;
        

npm install crypto-browserify


Edit

node_modules/react-scripts/config/webpack.config.js

insert in file around line 348:

    plugins: [
...
      ],
      fallback: {
        "crypto": false,
        "crypto-browserify": require.resolve('crypto-browserify'),
      }

webpack.config.js:

      fallback: {
        "crypto": require.resolve('crypto-browserify'),
        "crypto-browserify": require.resolve('crypto-browserify'),
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "fs": require.resolve('browserify-fs'),
        "stream": require.resolve("stream-browserify"),
      }


      Craco.config.js is now:

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