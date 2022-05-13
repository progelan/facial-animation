const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')


module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        devServer: {
            compress: true,
            hot: true,
            port: 9000,
        },
    }
)
