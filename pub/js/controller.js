'use strict';
import * as model from './model.js';
import * as views from './views.js';
import { hasEmptyValues } from './helpers.js';
import { Reply, Message, Rating } from './structs.js';

// -------------------------- //

// *_C 是 controller 中特有的函数，这些都绑定到了 views.js 里的事件监听器上，详见最后几行

// 1.1 获取消息 (fetch)
const fetchMsg_C = () => {
	model
		.getMessage()
		.then((messages) => {
			// 0. Guard clause
			if (!messages) throw new Error('no messages!');

			// 1. 渲染视图
			views.chatView.update(messages);
			// 2. 更新评分
			fetchRatings_C();
			// 3. 更新回复
			fetchReply_C();
		})
		.catch(console.error);
};

/** 1.2 发送消息
 * @param {Message} inputMessage
 */
const sendMsg_C = function (inputMessage) {
	// 1. 检查
	if (!hasEmptyValues(inputMessage)) {
		alert('用户名或消息不能为空 ');
		return;
	}

	// 2. 清除
	views.inputView.clearAll();

	// 3. 发送
	model.sendMessage(inputMessage);

	fetchMsg_C();
};

// ------ 4 评分 ------------ //

// 4.1 获取评分
const fetchRatings_C = () => {
	model
		.getRatings()
		.then((ratings) => {
			ratings.forEach((rating) => {
				views.ratingsView.render(rating);
			});
		})
		.catch(console.error);
};

// 4.2
/**
 * 发送评分 (Controller)
 * @param {string} id
 * @returns {undefined}
 */
const sendRatings_C = (id) => {
	const value = parseInt(prompt('给出你的评分'));
	const rating = new Rating({ id, value });
	// 检查评分是否合规
	if (!rating.isValid) {
		console.warn('评分不合规 Invalid Rating');
		return;
	}

	model.sendRatings(rating);
	fetchRatings_C();
};

// ---------- 5 回复 --------- //

const fetchReply_C = () => {
	model.getReply().then((replies) => {
		// 找到有回复的id
		const ids = new Set(replies.map((v) => v.to));
		// 清空之前显示的回复
		ids.forEach((id) => views.chatView.clearReply(id));
		// 渲染回复
		replies.forEach((reply) => {
			views.chatView.renderReply(reply);
		});
	});
};

/**
 * **发送回复** (Controller)
 * @param {string} id
 * @returns {undefined}
 */
const sendReply_C = (id) => {
	const text = prompt('回复：');
	if (!text) return;
	const reply = new Reply({ text, to: id });
	model.sendReply(reply);
	fetchReply_C();
};
// ------- 结束 ----------- //

// views.chatView.clearBtnOnclick(pwdCtrl);
views.inputView.oninput(sendMsg_C);
views.ratingsView.onclick(sendRatings_C);
views.chatView.onreply(sendReply_C);
fetchMsg_C();
