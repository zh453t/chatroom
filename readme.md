# 安装
环境需求：
 - node.js
 - npm
本项目只使用 express
```bash
npm i express
node server.mjs
```

# 配置
配置均在`config.json`中
 - "port" 监听端口
 - "hostname" 监听主机地址
 - "endpoints" 管理前端请求的路由，需要在`pub/js/model.js`里同步改动。
 - 