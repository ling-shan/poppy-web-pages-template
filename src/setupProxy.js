// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(
    /**
     * 如果设置为"^/api": "",则发送应为http://localhost:5000/api/manager/register，服务收到为http://localhost:4000/manager/register
     */
    createProxyMiddleware('/api-poppy', {
      target: 'http://poppy-api.lingyuan-tech.com', //服务器接口地址
      // target: 'http://127.0.0.1:7014', //服务器接口地址
      changeOrigin: true,
      pathRewrite: { '^/api-poppy': '' },
    }),
  )
}
