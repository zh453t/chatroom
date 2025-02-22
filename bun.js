import express from "express";
import { WebSocketServer } from "ws";
import { promises as fs } from "fs";
import config from "./pub/config.js";

// -- HTTP --
const app = express();
app.use(express.static(config.dirs.static));

app.get("/:type", async (req, res) => {
	const type = req.params.type;
	const path = config.dirs[type];

	try {
		await fs.access(path);
		const fileContent = await fs.readFile(path, "utf-8");
		res.setHeader("Content-Type", "application/json");
		res.send(fileContent);
	} catch (error) {
		if (error.code === "ENOENT") {
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

const updateFile = async (data) => {
	if (!data.type) return;
	const { type, ...datacopy } = data;
	const path = config.dirs[type];

	try {
		let previousData = [];
		try {
			await fs.access(path);
			const fileContent = await fs.readFile(path, "utf-8");
			previousData = JSON.parse(fileContent);
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
			console.error(`[WebSocket] File ${path} not found`);
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

		await fs.writeFile(path, JSON.stringify(previousData, null, 2));
	} catch (error) {
		console.error("Error updating file:", error);
	}
};

const broadcast = (data) => {
	WSServer.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(data));
		}
	});
};

WSServer.on("connection", (ws) => {
	console.info(`[WebSocket] NEW CONNECTION on ${config.hostname}:${config.port.websocket}`);

	ws.on("message", async (message) => {
		try {
			const data = JSON.parse(message.toString());
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
