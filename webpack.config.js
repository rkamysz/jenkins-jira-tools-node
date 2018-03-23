const path = require('path');

var nodeExternals = require('webpack-node-externals');

module.exports = {
    mode:'production',
    target: 'node',
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "bin"),
        libraryTarget: "commonjs2",
        filename: "jjt.js"
    },
    externals: [nodeExternals()]
}