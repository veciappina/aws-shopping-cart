const path = require('path')
const ipc = require('node-ipc')

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
    plugins: [
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
            ipc.config.id = 'VueCLI'
            ipc.config.retry = 1500
            ipc.config.silent = true
            const localServerId = 'localServer'
            ipc.connectTo(localServerId, () => {
              ipc.of[localServerId].on('connect', () => {
                ipc.of[localServerId].emit('FilesEmitted')
              })
            })
          })
        }
      },
    ]
  }
}
