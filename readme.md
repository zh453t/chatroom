# 安装
## 不安装 `JavaScript` 运行时
`release` 中有 `bun build --compile` 后的 exe 文件 (解压后约 110MB)，可以直接运行。
## 使用 `Bun` (推荐)
```bash
bun run bun.js
```
## 使用 `Deno`
```bash
deno run --allow-net --allow-read --allow-write --allow-env deno.js
```

## 使用 `node.js`
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
   - 数据库文件可以存在任何地方