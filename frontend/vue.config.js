const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src')
      }
    },
    devServer: {
      proxy: {
        '/dev/*/': {
          target: 'http://localhost:5000',
          secure: false,
          logLevel: 'error'
        }
      }
    },
  }
}
