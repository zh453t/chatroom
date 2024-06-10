'use strict';
import { Message, Reply, Rating } from './structs.js';
import { state } from './model.js';

// ------------ 消息 ------------ //

class ChatView {
	#messageContainer = document.querySelector('.chat-messages');
	// svgs
	#icons = {
		clockIcon: `<svg class="icon" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" fill-rule="evenodd"></path>
</svg>`,
		userIcon: `<svg class="icon" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" fill-rule="evenodd"></path>
</svg>`,
	};

	/**
	 * 生成在 <ul class="chat-messages"></ul> 中的 html
	 * generate html texts inside <ul class="chat-messages"></ul>
	 * @param {Message[]} messages
	 * @returns
	 */
	#generateMsgHTML(messages) {
		if (!messages) throw new Error('没有messages!');

		// 合成，转换成html
		return messages
			.reverse()
			.map((m) => {
				// 时间，从 time 中获取
				const date = new Date(m.time).toLocaleString();
				// 评分框
				const ratingBar = `<section data-id="${m.id}" class="ratingBlock">
        <div class="rating">--</div>
        <div class="ratingBar"> <div></div></div>
        </section>`;
				// 时间，用户这些二级信息
				const smallerText = `<div class="msg-info">
				<div class="info-cell">${this.#icons.clockIcon}${date}</div>
				<div class="info-cell">${this.#icons.userIcon}<span class="msg-user">${m.user}</span></div>
				</div>`;

				const displayContent = m.text.replaceAll('\n\n', '\n').replaceAll('\n', '</p><p>');

				const mainMsg = m.text.includes('\n') ? `<div class="msg-content return"><p>${displayContent}</p></div>` : `<div class="msg-content"><p>${displayContent}</p></div>`;

				// 合并成一个 <li>
				return `<li class="chat-content" data-id="${m.id}">
        <section class="msg-main">${mainMsg}${smallerText}</section>
        ${ratingBar}
        <ul class="reply"></ul>
        </li>`;
			})
			.join('');
	}

	/**
	 * 渲染消息 render messages
	 * @param {Message[]} messages 例如 { text: "内容", id: "lnssdsag", user: "", time: }
	 */
	update(messages) {
		const messageHTML = this.#generateMsgHTML(messages);
		const prevHTML = this.nowHTML;
		if (messageHTML === prevHTML) {
			console.info('没有新的消息');
			return;
		}

		// 如果新的html比现在的少：(可能是清空了)
		if (!messageHTML.includes(prevHTML)) {
			this.#messageContainer.innerHTML = messageHTML;
			return;
		}

		this.#messageContainer.insertAdjacentHTML('beforeend', messageHTML.replace(prevHTML, ''));
	}

	/**
	 * 渲染回复
	 * render
	 * @param {Reply} reply
	 */
	renderReply(reply) {
		const container = this.#messageContainer.querySelector(`.chat-content[data-id="${reply.to}"] ul.reply`);
		if (!container) return console.warn('reply for an unknown message.', reply);
		const time = new Date(reply.time).toLocaleString();

		// +=
		container.insertAdjacentHTML(
			'beforeend',
			`<li class="reply-msg">
    <section class="reply-content">${reply.text}</section>
    <section class="reply-info"><div class="info-cell">${this.#icons.clockIcon}${time}</div></section>
    </li>`
		);
	}

	/**
	 * 在页面上清除特定id的回复
	 * clear reply by message id
	 * @param {string} id
	 */
	clearReply(id) {
		const container = this.#messageContainer.querySelector(`.chat-content[data-id="${id}"] ul.reply`);
		if (!container) return console.warn(`reply for an unknown message (id: ${id}).`);
		container.innerHTML = '';
	}

	/**
	 * 回复事件监听器
	 * Reply event listener
	 * @param {function} handler
	 */
	onreply(handler) {
		this.#messageContainer.addEventListener('click', (e) => {
			const clickedElement = e.target.closest('.chat-content');
			if (clickedElement === null || e.target.closest('.ratingBlock')) return;
			const id = clickedElement.dataset.id;
			handler(id);
		});
	}
	/**
	 * **清除页面上的所有消息**
	 */
	clearAll() {
		this.#messageContainer.innerHTML = '';
	}

	/**
	 * 查看现在渲染的消息
	 * look up rendered html now
	 */
	get nowHTML() {
		return this.#messageContainer.innerHTML;
	}
}

// --------- 评分 ----------- //

class RatingsView {
	// avgRating;
	get #ratingContainers() {
		return [...document.querySelectorAll('.ratingBlock')];
	}
	chatContainer = document.querySelector('.chat-messages');

	/**
	 * <section class="ratingBlock"> 事件监听器 | .ratingBlock click event listener
	 * @param {function} handler
	 */
	onclick(handler) {
		this.chatContainer.addEventListener('click', (e) => {
			const ratingBlock = e.target.closest('.ratingBlock');
			if (!ratingBlock) return;
			const id = ratingBlock.dataset.id;
			handler(id);
		});
	}

	/**
	 * 渲染评分
	 * render ratings
	 * @param {{id: string, allRatings: number[]}} _
	 */
	render({ id, allRatings }) {
		const ratingsAvg = Rating.calcAvg(allRatings);
		const index = state.ids.indexOf(id);
		if (index === -1) {
			// 如果找不着，放进待清除名单
			state.wasteIDs.push(id);
			return;
		} // 根本没有

		const container = this.#ratingContainers[index];
		const bar = container.querySelector('.ratingBar div');

		this.#renderText(container, ratingsAvg);
		this.#renderBar(bar, ratingsAvg);
	}

	/**
	 * 渲染评分
	 * @param {Element} ratingContainer
	 * @param {Number} avgRating
	 */
	#renderText(ratingContainer, avgRating) {
		ratingContainer.querySelector('.rating').innerHTML = `${avgRating}`;
	}

	/**
	 * 渲染彩色小条
	 * render rating bar
	 * @param {Element} ratingBar
	 * @param {Number} ratingValue
	 */
	#renderBar(ratingBar, ratingValue) {
		ratingBar.style.width = `${ratingValue}%`;

		if (ratingValue < 60) ratingBar.classList.add('red');
		else if (ratingValue < 80) ratingBar.classList.add('yellow');
		else ratingBar.classList.add('green');
	}
}

// ------- 表单 ------------ //

class InputView {
	#form = document.querySelector('form.chat-input');
	#inputEl = this.#form.querySelector('.input--textarea');

	/**
	 * 文本输入时执行传入的函数
	 * @param {function} eventListener
	 */
	oninput(eventListener) {
		
		/**
		 * 
		 * @param {Event} e 
		 */
		const handler = function (e) {
			e.preventDefault();
			eventListener(this.inputMessage);
		};
		this.#form.addEventListener('submit', handler.bind(this));
	}

	clearAll() {
		this.#inputEl.value = '';
	}

	get inputMessage() {
		const data = new FormData(this.#form);
		const obj = Object.fromEntries(data.entries());
		return new Message(obj);
	}
}

// ------------- 时间 --------------------//

class Time {
	#timeElememt = document.querySelector('#time');
	/**
	 * render time
	 * @param {string} time locale time string
	 */
	#render(time) {
		this.#timeElememt.textContent = time;
	}
	constructor() {
		this.#render(new Date().toLocaleTimeString());
		// 1. 获取现在的毫秒数
		const mStart = new Date().getMilliseconds();
		// 2. 校准时间
		setTimeout(() => {
			setInterval(() => {
				this.#render(new Date().toLocaleTimeString());
			}, 1000);
		}, 1000 - mStart); //😎
	}
}

export const inputView = new InputView();
export const chatView = new ChatView();
new Time();
export const ratingsView = new RatingsView();
