# 安装
环境需求：
 - node.js

```bash
npm install express ws
node server.js
```
本项目使用 `express` 托管静态文件，使用 `WebSocket` 实时通讯
# 配置
在 `pub/config.js` 中
 - `port` 监听端口
 - `hostname` 监听主机地址
 - `secure` 是否支持 `https` `wss` 等安全协议
 - `dir` 数据库文件存放路径