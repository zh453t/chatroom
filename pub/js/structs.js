export class Message {
	// /** @type {string} */ type = 'message';
	/** @type {string} */ text;
	/** @type {string} */ user;
	/** @type {number} */ time = Date.now();
	// Generate ID
	/** @type {string} */ id = (this.time + Math.trunc(Math.random() * 10000000)).toString(36);

	/** @param {{text: string, user: string}} _ */
	constructor({ text, user }) {
		this.text = text;
		this.user = user;
	}
}

/**
 * see {@link Message}
 */
export class Reply extends Message {
	/** @type {string} */ type = 'reply';
	/** @type {string} */ to;

	/** @param {{text: string, user: string, to: string}} _ */
	constructor({ text, user, to }) {
		super({ text, user });
		this.to = to;
	}
}

export class Rating {
	/** @type {string} */ id;
	/** @type {number} */ value;
	constructor({ id, value }) {
		this.id = id;
		this.value = value;
	}

	/**
	 * 检查评分是否有效
	 * @returns {boolean}
	 */
	get isValid() {
		return Number.isFinite(this.value) && 0 <= this.value && this.value <= 100;
	}

	/**
	 * 取平均
	 * @param {num[]} arr
	 * @returns {number}
	 */
	static calcAvg(arr) {
		const sum = arr.reduce((prev, cur) => prev + cur);
		return Math.round(sum / arr.length);
	}
}
