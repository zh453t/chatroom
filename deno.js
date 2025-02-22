import express from "npm:express@^4.21.2";
import { WebSocketServer, WebSocket } from "npm:ws@^8.18.0";
import config from "./pub/config.js";

// -- HTTP --
const app = express();
app.use(express.static(config.dirs.static));

app.get("/:type", async (req, res) => {
	const type = req.params.type;
	const path = config.dirs[type];

	try {
		// 检查文件是否存在
		await Deno.stat(path);
		// 读取文件内容
		const fileContent = await Deno.readTextFile(path);
		res.setHeader("Content-Type", "application/json");
		res.send(fileContent);
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) {
			res.status(404).send("File not found");
		} else {
			res.status(500).send("Internal server error");
		}
	}
});

app.listen(config.port.http, config.hostname, () => {
	console.info(`[HTTP] Listening on ${config.hostname}:${config.port.http}`);
});

// -- WebSocket --
const WSServer = new WebSocketServer({ port: config.port.websocket });

// WebSocket 处理逻辑
const updateFile = async (data) => {
	if (!data.type) return;
	const { type, ...datacopy } = data;
	const path = config.dirs[type];

	try {
		let previousData = [];
		try {
			await Deno.stat(path);
			const fileContent = await Deno.readTextFile(path);
			previousData = JSON.parse(fileContent);
		} catch (error) {
			if (error instanceof Deno.errors.NotFound) {
				console.error(`[WebSocket] File ${path} not found`);
			} else {
				throw error;
			}
		}

		if (type === "rating") {
			let target = previousData.find((r) => r.id === data.id);
			if (!target) {
				target = { id: data.id, ratings: [] };
				previousData.push(target);
			}
			target.ratings.push(data.value);
		} else {
			previousData.push(datacopy);
		}

		await Deno.writeTextFile(path, JSON.stringify(previousData, null, 2));
	} catch (error) {
		console.error("Error updating file:", error);
	}
};

const broadcast = (data) => {
	for (const client of WSServer.clients) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(data));
		}
	}
};

WSServer.on("connection", (ws) => {
	console.info(`[WebSocket] NEW CONNECTION on ${config.hostname}:${config.port.websocket}`);

	ws.on("message", async (message) => {
		try {
			const data = Object.freeze(JSON.parse(message.toString()));
			console.log(data);

			await updateFile(data);
			broadcast(data);
		} catch (error) {
			console.error("[WebSocket] Invalid JSON:", error);
		}
	});
});

WSServer.on("close", () => {
	console.info("[WebSocket] CLOSED");
});
