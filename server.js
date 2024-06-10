'use strict';
import express from 'express';
import fs from 'fs';
import { resetFile, sendErrorResponse } from './helpers.js';
import config from './config.js';
const app = express();
app.use(express.json());

const state = {
	replies: JSON.parse(fs.readFileSync(config.dirs.repliesData, 'utf-8')),
};

// publish static files
app.use(express.static('./pub'));

// ------------ messages --------------- //

/**
 * 添加消息
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const postMessages = (req, res) => {
	if (!req.body.user && req.body.content) {
		res.status(400).send('Cannot post: Invalid syntax');
		return;
	}

	fs.readFile(config.dirs.msgData, 'utf-8', (err, data) => {
		if (err) console.error(err);

		// parse
		if (!data) {
			sendErrorResponse(res, 'Please try again 请重试一次');
			resetFile(config.dirs.msgData);
			return;
		}
		const json = JSON.parse(data);
		if (!Array.isArray(json)) {
			sendErrorResponse(res, 'Please try again 请重试一次');
			resetFile(config.dirs.msgData);
			return;
		}

		// push
		json.push(req.body);
		// write
		fs.writeFile(config.dirs.msgData, JSON.stringify(json), (err) => {
			if (err) console.error(err);
			res.status(201).send('Success.');
		});
	});
};
app.route(config.endpoints.message).post(postMessages);

// ----- ratings ---- //

/**
 * 添加评分 {id, rating}
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const postRatings = (req, res) => {
	// 检查
	if (!req.body.every((v) => v.id && v.allRatings)) {
		res.status(400).send('Cannot post: Invalid syntax');
		return;
	}
	// 更新文件
	fs.writeFile(config.dirs.ratingsData, JSON.stringify(req.body), (err) => {
		if (err) console.error(err);
		res.status(201).send('Success.');
	});
};
app.route(config.endpoints.rating).post(postRatings);

// ------- replies ------ //
/**
 * 添加评分 {text, to, time}
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const postReply = (req, res) => {
	const reply = req.body;
	// 检查
	if (!reply || !reply.text || !reply.to || !reply.time) {
		res.status(400).send('Cannot post: Invalid syntax');
		return;
	}

	state.replies.push(reply);
	// 不想防止最初是空字符串

	fs.writeFile(config.dirs.repliesData, JSON.stringify(state.replies), (err) => {
		if (err) console.error(err);
		res.status(201).send('Success.');
	});
};

/**
 * 删评 time
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const deleteReply = (req, res) => {
	const { time } = req.body;
	if (!time) {
		res.status(400).send('Cannot delete: Invalid syntax');
		return;
	}
	// state.replies = state.replies.filter((reply) => reply.time !== time);
	fs.writeFile(config.dirs.repliesData, JSON.stringify(state.replies), (err) => {
		console.error(err);
		res.status(201).send('Success.');
	});
};

app.route(config.endpoints.reply).post(postReply).delete(deleteReply);

app.listen(config.port, config.hostname, () => {
	console.log(`Listening on ${config.hostname}:${config.port}`);
});
