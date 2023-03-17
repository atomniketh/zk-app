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

