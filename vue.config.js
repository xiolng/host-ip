const path = require('path')
const webpack = require('webpack')
const resolve = dir => {
    return path.join(__dirname, dir)
}
// console.log(1111, process.env.VUE_APP_DIST);
module.exports = {
    publicPath: process.env.VUE_APP_DIST ? './' : '/',
    configureWebpack: {
        // assetsDir: './'
    },
    productionSourceMap: false
}