/**
 * 检查是否有空值
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


//----------------------------//

/** @param {string} url */
export const getJSON = async function (url) {
	try {
		const response = await fetch(url);
		return await response.json();
	} catch (error) {
		console.trace(error);
	}
};

/**
 * @param {string} url
 * @param {string} body
 */
export const postJSON = function (url, body) {
	try {
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
	} catch (error) {
		console.error(error);
	}
};
