const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
    publicPath: process.env.VUE_APP_VERSION === 'BuildAction' ? './' : '/',
    transpileDependencies: ['vuetify'],
    productionSourceMap: false
});
