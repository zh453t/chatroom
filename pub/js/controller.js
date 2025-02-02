'use strict';
import * as model from './model.js';
import * as views from './views.js';
import { Reply, Message, Rating } from './structs.js';

/**
 * 初始化消息
 */
const initMessage = () => {
	model
		.get('message')
		.then((messages) => {
			// 检查
			if (!messages) throw new Error('no messages!');

			// 1. 渲染视图
			views.chatView.render(messages);
			// 2. 更新评分
			initRatings();
			// 3. 更新回复
			initReply();
		})
		.catch(console.error);
};

/**
 * 发送消息
 * @param {Message} inputMessage
 */
const sendMessage = function (inputMessage) {
	// 检查
	if (inputMessage.hasEmptyValues) {
		alert('用户名或消息不能为空 ');
		return;
	}

	// 清除
	views.inputView.clear();

	// 发送
	model.send(inputMessage);
	// 渲染 可以等 broadcast() 之后再渲染
	// views.chatView.append(inputMessage);
};

/**
 * 初始化评分
 */
const initRatings = () => {
	model
		.get('rating')
		.then((data) => {
			// 存入 state
			model.state.ratings = data;
			// 渲染
			data.forEach(
				/** @param {{id, ratings}} rating */
				function renderRating(rating) {
					views.ratingsView.render(rating);
				}
			);
		})
		.catch(console.error);
};

/**
 * 发送评分 (Controller)
 * @param {string} id
 */
const sendRating = (id) => {
	const value = parseInt(prompt('给出你的评分'));
	const rating = new Rating({ id, value });
	// 检查评分是否合规
	if (!rating.isValid) {
		console.warn('评分不合规');
		return;
	}

	// 发送
	model.send(rating);
	// 等收到 broadcast 后再渲染
};

/**
 * 初始化回复
 */
const initReply = () => {
	model.get('reply').then((replies) => {
		// 逐条渲染
		replies.forEach((reply) => {
			views.replyView.render(reply);
		});
	});
};

/**
 * 发送回复
 * @param {string} id - 目标消息的 ID
 */
const sendReply = (id) => {
	// 获取回复
	const text = prompt('回复：');
	if (!text) return;
	const reply = new Reply({ text, user: model.state.user, to: id });
	model.sendReply(reply);
	fetchReply_C();
};
// ------- 结束 ----------- //

// views.chatView.clearBtnOnclick(pwdCtrl);
views.inputView.onsubmit(sendMsg_C);
views.ratingsView.onclick(sendRatings_C);
views.chatView.onreply(sendReply_C);
fetchMsg_C();
