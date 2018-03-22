const path = require('path');

var nodeExternals = require('webpack-node-externals');

module.exports = {
    mode:'production',
    target: 'node',
    entry: "./src/appWrapper",
    output: {
        path: path.resolve(__dirname, "bin"),
        filename: "jjt.js"
    },
    externals: [nodeExternals()]
}