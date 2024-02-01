'use strict';
import express from 'express';
import fs, { readFileSync } from 'fs';
import { init, sendErrorResponse } from './helpers.mjs';

const app = express();
app.use(express.json());
const config = JSON.parse(readFileSync('./config.json', 'utf-8', (err) => console.error(err)));

const state = {
	replies: JSON.parse(fs.readFileSync(config.dirs.repliesData, 'utf-8')),
};

app.use(express.static('./pub'));

// ------------ 消息 --------------- //

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
			return init(config.dirs.msgData);
		}
		const json = JSON.parse(data);
		if (!Array.isArray(json)) {
			sendErrorResponse(res, 'Please try again 请重试一次');
			return init(config.dirs.msgData);
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

// ----- 评分 ---- //

/**
 * 添加评分 {id, rating}
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const postRatings = (req, res) => {
	// 检查
	if (!req.body.every((v) => v.id && v.rating)) {
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

// ------- 回复 ------ //
/**
 * 添加评分 {content, for, time}
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const postReply = (req, res) => {
	const reply = req.body;
	// 检查
	if (!reply || !reply.content || !reply.for || !reply.time) {
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
