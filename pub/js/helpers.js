/**
 * 检查
 * @param {object} obj
 * @returns {boolean}
 */
export function hasEmptyValues(obj) {
	// 如果是map:
	// const values = [...map.values()];
	const values = Object.values(obj);
	// 有空的就返回 false
	return values.every((value) => value !== '');
}

/**
 * 检查评分是否有效
 * @param {number} rating
 * @returns {boolean}
 */
export const isRatingValid = (rating) => Number.isFinite(rating) && 0 <= rating && rating <= 100;

export class Message {
	content;
	user;
  time = Date.now();
	id = this.#genID();
	constructor({ content, user }) {
		this.content = content;
		this.user = user;
	}
	get postBody() {
		return JSON.stringify();
	}

	#genID() {
		return (this.time + Math.trunc(Math.random() * 10000000)).toString(36);
	}
}

/**
 * 取平均
 * @param {Array} arr
 * @returns {Number}
 */
export function calcAvg(arr) {
	const sum = arr.reduce((prev, cur) => prev + cur);
	return Math.round(sum / arr.length);
}

//----------------------------//

// 配置文件
export const config = {
	version: '1.0.0 (2024/02/01)',
};

export const getJSON = async function (url) {
	try {
		const response = await fetch(url);
		return await response.json();
	} catch (error) {
		console.trace(error);
	}
};

export const postJSON = function (url, postBody) {
	try {
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(postBody),
		});
	} catch (error) {
		console.error(error);
	}
};
