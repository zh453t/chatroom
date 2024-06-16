// ratAll ==> All Ratings, 所有的评分 // 形式: [{id, rating}, ...]
// rating 单个评分

import { getJSON, postJSON } from './helpers.js';
import { Message, Reply, Rating } from './structs.js';

export const state = {
	/** @type {Message[]} */
	messages: [],
	/** @type {string[]} */
	get ids() {
		return this.messages.map((m) => m.id);
	},
	/** @type {{id: string, allRatings: number[]}[]} */
	ratings: [],
	/** @type {{id: string, allRatings: number[]}[]} */
	get filteredRatings() {
		return this.ratings.filter((r) => {
			return !this.wasteIDs.some((id) => id === r.id);
		});
	},

	/**
	 * 设置新的评分，会在 controller.js 里被调用
	 * @param {Rating} _
	 */
	set newRating({ id, value }) {
		// 如果 id 已存在，则追加，如果不存在则创建
		const index = this.ratings.findIndex((u) => u.id === id);
		// 🔼 找到id的位置
		if (index === -1) {
			// 新建
			this.ratings.push({ id, allRatings: [value] });
		} else {
			// 追加
			this.ratings[index].allRatings.push(value);
		}
	},

	/** @type {string[]} */
	wasteIDs: [],

	/** @type {string} */
	// 从 localStorage 中读取
	user: localStorage.getItem("user") ?? "",
};

/**
 * 和 state 里面的 messages 比对，如果一样就返回null⬇️
 * @returns {Promise<array>}
 */
export async function getMessage() {
	const messages = await getJSON('./database/messages.json');

	if (state.messages === messages) return null;

	state.messages = messages;
	return messages;
	// 这是一个数组，包含所有messag1es对象Object { text: "？", time: "2023-09-09 17:57:48" }
}

/**
 * 发送文字信息
 * @param {Message} message
 */
export function sendMessage(message) {
	postJSON('./api/messages', message);
}

// -------- 评分 ------------- //

/**
 * 获取评分
 * @returns {Promise<{id: string, allRatings: number[]}[]>}
 */
export async function getRatings() {
  const ratings = await getJSON('./database/ratings.json')
	state.ratings = ratings;
	return ratings;
}

/**
 * 发送新的评分， newRating 是一个 Setter, 会在ratings里追加 { id, rating }
 * @param {Rating} rating
 */
export function sendRatings(rating) {
  console.info(`sending rating for ${rating.id}: ${rating.value}`)
	state.newRating = rating;
	const ratings = state.wasteIDs ? state.filteredRatings : state.ratings;
	postJSON('./api/ratings', ratings);
}

// --------- 回复 ---------- //
/**
 * 发送回复至服务器
 * @param {Reply} reply
 */
export function sendReply(reply) {
	postJSON('./api/reply', reply);
}

/**
 * 获取回复
 * @returns {Promise<Reply[]>}
 */
export async function getReply() {
	const replies = await getJSON('./database/replies.json');
	return replies;
}