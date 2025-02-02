'use strict';
import express from 'express';
import * as fs from 'fs/promises';
import { WebSocketServer, WebSocket } from 'ws';
import config from './pub/config.js';

// -- HTTP --
const app = express();
app.use(express.static('./pub'));

app.listen(config.port.http, config.hostname, () => {
	console.info(`[HTTP] Listening on ${config.hostname}:${config.port.http}`);
});

// -- WebSocket --
const WSServer = new WebSocketServer({ port: config.port.websocket });

// WebSocket Helpers
const updateFile = async (data) => {
	// 分离 `type` 属性和其他属性，复制 data 因为 broadcast() 会用到
	if (!data.type) return;
	const { type, ...datacopy } = data;
	const path = config.dirs[type];

	try {
		// 读取文件，如果文件不存在，则初始化为空数组
		let previousData = [];
		try {
			const fileContent = await fs.readFile(path, 'utf8');
			previousData = JSON.parse(fileContent);
		} catch (error) {
			if (error.code !== 'ENOENT') throw error; // 忽略文件不存在的错误
		}

		// rating 因为数据结构不同，单独处理
		// 发送 {type, id, value}
		// 数据库中 {id, ratings}
		if (type === 'rating') {
			// 查找 id
			let target = previousData.find((rating) => rating.id === data.id);

			if (!target) {
				target = { id: data.id, ratings: [] };
				previousData.push(target);
			}
			target.ratings.push(data.value);
		} else {
			// 对于 message, reply
			previousData.push(datacopy);
		}
		await fs.writeFile(path, JSON.stringify(previousData, null, 2));
	} catch (error) {
		console.error(error);
	}
};

const broadcast = (data) => {
	WSServer.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(data)); // 只发送给打开的连接
		}
	});
};

WSServer.on('connection', (ws) => {
	console.info(`[WebSocket] NEW CONNECTION on ${config.hostname}:${config.port.websocket}`);
	// ws.send('Welcome to the server!');
	ws.on('message', (data, isBinary) => {
		// JSON 解析并冻结
		data = Object.freeze(JSON.parse(data));

		console.log(data);

		// 更新文件内容
		updateFile(data).then(() => {
			// 传送新消息给所有socket连接
			broadcast(data);
		});
	});
});

WSServer.on('close', () => {
	console.info('[WebSocket] CLOSED');
});
