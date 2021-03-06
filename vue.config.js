// eslint-disable-next-line @typescript-eslint/no-var-requires
const theme = require('./src/configs/theme')

module.exports = {
  css: {
    loaderOptions: {
      less: {
        additionalData: '@import "@/assets/less/global.less";',
        lessOptions: {
          modifyVars: theme
        }
      }
    }
  }
}
