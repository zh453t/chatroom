import { Message, Reply, Rating } from './structs.js';
import config from '../config.js';

export const state = {
	ratings: [],
<<<<<<< HEAD
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
=======
>>>>>>> 64ce306 (Websocket Version (v2.0.0))
};

// -- websocket --
export const socket = new WebSocket(`ws://${config.hostname}:${config.port.websocket}`);

// -- http --
/**
 * get everyting
 * @param {string} type 
 * @returns {Promise<Message[] | {id, ratings}[] | Reply[]>} promise from fetch()
 */
export const get = (type) => fetch(`${config.dirs[type].replace('./pub/', './')}`).then((res) => res.json());

/**
 * send everyting
 * @param {Message | Reply | Rating} data
 */
export const send = (data) => {
	// 错误处理
	if (!socket.readyState === WebSocket.OPEN) {
		throw new Error('Websocket is closed');
	}

	// 使用 socket 发送
	socket.send(JSON.stringify(data))
};