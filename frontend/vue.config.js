const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src')
      }
    },
    stats: 'errors-only',
    devServer: {
      proxy: {
        '/api/*/': {
          target: 'http://localhost:5000',
          secure: false,
          logLevel: 'error',
          pathRewrite: { '^/api/': '/' }
        }
      }
    },
  }
}
