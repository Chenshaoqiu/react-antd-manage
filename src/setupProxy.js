const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const target = process.env.REACT_APP_API_URL; // 从环境变量中读取目标地址
  console.log('----------process-------', process.env.REACT_APP_API_URL);

  if (!target) {
    console.error('未配置 REACT_APP_API_URL 环境变量');
    return;
  }

  app.use(
    '/api', // 代理的路径
    createProxyMiddleware({
      target, // 使用环境变量中的目标地址
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // 去掉路径前缀
      },
    })
  );
};
