"use strict";
import { Message, Reply, Rating } from "./structs.js";
import { state } from "./model.js";
const icons = {
  clockIcon: `<svg class="icon" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" fill-rule="evenodd"></path>
</svg>`,
  userIcon: `<svg class="icon" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" fill-rule="evenodd"></path>
</svg>`,
};

// 消息
class ChatView {
<<<<<<< HEAD
  #messageContainer = document.querySelector(".chat-messages");
  // svgs

  /**
   * 生成在 <ul class="chat-messages"></ul> 中的 html
   * generate html texts inside <ul class="chat-messages"></ul>
   * @param {Message[]} messages
   * @returns
   */
  #generateMsgHTML(messages) {
    if (!messages) throw new Error("没有messages!");

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
				<div class="info-cell">${icons.clockIcon}${date}</div>
				<div class="info-cell">${icons.userIcon}<span class="msg-user">${m.user}</span></div>
				</div>`;

        const displayContent = m.text
          .replaceAll("\n\n", "\n")
          .replaceAll("\n", "</p><p>");

        const mainMsg = m.text.includes("\n")
          ? `<div class="msg-content return"><p>${displayContent}</p></div>`
          : `<div class="msg-content"><p>${displayContent}</p></div>`;

        // 合并成一个 <li>
        return `<li class="chat-content" data-id="${m.id}">
        <section class="msg-main">${mainMsg}${smallerText}</section>
        ${ratingBar}
        <ul class="reply"></ul>
        </li>`;
      })
      .join("");
  }

  /**
   * 渲染消息 render messages
   * @param {Message[]} messages 例如 { text: "内容", id: "lnssdsag", user: "", time: }
   */
  update(messages) {
    const messageHTML = this.#generateMsgHTML(messages);
    const prevHTML = this.nowHTML;
    if (messageHTML === prevHTML) {
      console.info("没有新的消息");
      return;
    }

    // 如果新的html比现在的少：(可能是清空了)
    if (!messageHTML.includes(prevHTML)) {
      this.#messageContainer.innerHTML = messageHTML;
      return;
    }

    this.#messageContainer.insertAdjacentHTML(
      "beforeend",
      messageHTML.replace(prevHTML, "")
    );
  }

  /**
   * 渲染回复
   * render
   * @param {Reply} reply
   */
  renderReply(reply) {
    const container = this.#messageContainer.querySelector(
      `.chat-content[data-id="${reply.to}"] ul.reply`
    );
    if (!container) return console.warn("reply for an unknown message.", reply);
    const time = new Date(reply.time).toLocaleString();

    // +=
    container.insertAdjacentHTML(
      "beforeend",
      `<li class="reply-msg">
    <section class="reply-content">${reply.text}</section>
    <section class="reply-info">
			<div class="info-cell">${icons.clockIcon}${time}</div>
			<div class="info-cell">${icons.userIcon}${reply.user}</div>
		</section>
    </li>`
    );
  }

  /**
   * 在页面上清除特定id的回复
   * clear reply by message id
   * @param {string} id
   */
  clearReply(id) {
    const container = this.#messageContainer.querySelector(
      `.chat-content[data-id="${id}"] ul.reply`
    );
    if (!container)
      return console.warn(`reply for an unknown message (id: ${id}).`);
    container.innerHTML = "";
  }

  /**
   * 回复事件监听器
   * Reply event listener
   * @param {function} handler
   */
  onreply(handler) {
    this.#messageContainer.addEventListener("click", (e) => {
      const clickedElement = e.target.closest(".chat-content");
      if (clickedElement === null || e.target.closest(".ratingBlock")) return;
      const id = clickedElement.dataset.id;
      handler(id);
    });
  }
  /**
   * **清除页面上的所有消息**
   */
  clearAll() {
    this.#messageContainer.innerHTML = "";
  }

  /**
   * 查看现在渲染的消息
   * look up rendered html now
   */
  get nowHTML() {
    return this.#messageContainer.innerHTML;
  }
=======
	msgContainer = document.querySelector('.chat-messages');

	// svg 图表
	icons = {
		clockIcon: `<svg class="icon" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" fill-rule="evenodd"></path>
</svg>`,
		userIcon: `<svg class="icon" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" fill-rule="evenodd"></path>
</svg>`,
	};

	/**
	 * 生成消息元素
	 * @param {Message} message - 消息
	 * @returns {HTMLElement} - 返回一个消息元素
	 * */
	#generateElement(message) {
		// 创建外部的 <li> 元素
		const msgEl = document.createElement('li');
		msgEl.classList.add('chat-content');
		msgEl.dataset.id = message.id;

		// 创建 msg-main 部分
		const msgMain = document.createElement('section');
		msgMain.classList.add('msg-main');

		// 时间处理
		const date = new Date(message.time).toLocaleString();
		const smallerText = document.createElement('div');
		smallerText.classList.add('msg-info');

		const infoCellTime = document.createElement('div');
		infoCellTime.classList.add('info-cell');
		infoCellTime.innerHTML = `${this.icons.clockIcon}${date}`;

		const infoCellUser = document.createElement('div');
		infoCellUser.classList.add('info-cell');
		infoCellUser.innerHTML = `${this.icons.userIcon}<span class="msg-user">${message.user}</span>`;

		smallerText.appendChild(infoCellTime);
		smallerText.appendChild(infoCellUser);

		// 创建 msg-content 部分
		const mainMsg = document.createElement('div');
		mainMsg.classList.add('msg-content');
		if (message.text.includes('\n')) {
			mainMsg.classList.add('return');
			const pContent = document.createElement('p');
			// ???
			pContent.innerHTML = message.text.replaceAll('\n\n', '\n').replaceAll('\n', '</p><p>');
			mainMsg.appendChild(pContent);
		} else {
			const pContent = document.createElement('p');
			pContent.textContent = message.text;
			mainMsg.appendChild(pContent);
		}

		// 创建 ratingBar 部分
		const ratingBar = document.createElement('section');
		ratingBar.classList.add('ratingBlock');
		ratingBar.dataset.id = message.id;

		const rating = document.createElement('div');
		rating.classList.add('rating');
		rating.textContent = '--';

		const ratingBarInner = document.createElement('div');
		ratingBarInner.classList.add('ratingBar');
		const ratingInnerDiv = document.createElement('div');
		ratingBarInner.appendChild(ratingInnerDiv);

		ratingBar.appendChild(rating);
		ratingBar.appendChild(ratingBarInner);

		// 创建 reply 列表
		const replyList = document.createElement('ul');
		replyList.classList.add('reply');

		// 将子元素插入到 msgEl 中
		msgMain.appendChild(mainMsg);
		msgMain.appendChild(smallerText);
		msgEl.appendChild(msgMain);
		msgEl.appendChild(ratingBar);
		msgEl.appendChild(replyList);

		return msgEl;
	}

	/**
	 * 渲染消息
	 * @param {Message[]} messages - 消息数组
	 */
	render(messages) {
		// 创建文档片段。将所有消息添加到文档片段中，然后一次性添加到 DOM 中
		const fragment = document.createDocumentFragment();
		messages.forEach((message) => {
			fragment.appendChild(this.#generateElement(message));
		});
		this.msgContainer.appendChild(fragment);
	}

	/**
	 * 添加消息
	 *  @param {Message} message - 消息
	 * */
	append(message) {
		const childNodes = this.msgContainer.children;
		const fragment = this.#generateElement(message);
		this.msgContainer.insertBefore(fragment, childNodes[0]);
	}
}

// 回复
class ReplyView extends ChatView {
	constructor() {
		super();
	}
	msgContainer = document.querySelector('.chat-messages');

	/**
	 * 生成回复元素
	 * @param {Reply} reply - 回复
	 * @returns {HTMLElement} - 返回一个回复元素
	 * */
	#generateElement(reply) {
		const replyEl = document.createElement('li');
		replyEl.classList.add('reply-msg');

		const replyContent = document.createElement('section');
		replyContent.classList.add('reply-content');
		replyContent.textContent = reply.text;

		const replyInfo = document.createElement('section');
		replyInfo.classList.add('reply-info');

		const infoCell = document.createElement('div');
		infoCell.classList.add('info-cell');
		const time = new Date(reply.time).toLocaleString();
		infoCell.innerHTML = `${this.icons.clockIcon}${time}`;

		replyInfo.appendChild(infoCell);

		replyEl.appendChild(replyContent);
		replyEl.appendChild(replyInfo);

		return replyEl;
	}

	/**
	 * 渲染回复
	 * @param {Reply} reply
	 */
	render(reply) {
		// 获取回复的容器
		const container = this.msgContainer.querySelector(`.chat-content[data-id="${reply.to}"] ul.reply`);
		if (!container) return console.warn('reply for an unknown message.', reply);
		// 添加回复
		container.appendChild(this.#generateElement(reply));
	}

	/**
	 * 在页面上清除特定id的回复
	 * clear reply by message id
	 * @param {string} id
	 */
	clear(id) {
		const container = this.msgContainer.querySelector(`.chat-content[data-id="${id}"] ul.reply`);
		if (!container) return console.warn(`reply for an unknown message (id: ${id}).`);
		container.innerHTML = '';
	}

	/**
	 * 回复事件监听器
	 * Reply event listener
	 * @param {function} handler
	 */
	onreply(handler) {
		this.msgContainer.addEventListener('click', (e) => {
			const clickedElement = e.target.closest('.chat-content');
			if (clickedElement === null || e.target.closest('.ratingBlock')) return;
			const id = clickedElement.dataset.id;
			handler(id);
		});
	}
>>>>>>> 64ce306 (Websocket Version (v2.0.0))
}

// 评分
class RatingsView {
  // avgRating;
  get #ratingContainers() {
    return [...document.querySelectorAll(".ratingBlock")];
  }
  chatContainer = document.querySelector(".chat-messages");

  /**
   * <section class="ratingBlock"> 事件监听器 | .ratingBlock click event listener
   * @param {function} handler
   */
  onclick(handler) {
    this.chatContainer.addEventListener("click", (e) => {
      const ratingBlock = e.target.closest(".ratingBlock");
      if (!ratingBlock) return;
      const id = ratingBlock.dataset.id;
      handler(id);
    });
  }

<<<<<<< HEAD
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
    const bar = container.querySelector(".ratingBar div");

    this.#renderText(container, ratingsAvg);
    this.#renderBar(bar, ratingsAvg);
  }

  /**
   * 渲染评分
   * @param {Element} ratingContainer
   * @param {Number} avgRating
   */
  #renderText(ratingContainer, avgRating) {
    ratingContainer.querySelector(".rating").innerHTML = `${avgRating}`;
  }

  /**
   * 渲染彩色小条
   * render rating bar
   * @param {Element} ratingBar
   * @param {Number} ratingValue
   */
  #renderBar(ratingBar, ratingValue) {
    ratingBar.style.width = `${ratingValue}%`;
=======
	/**
	 * 渲染评分
	 * render ratings
	 * @param {{id: string, ratings: number[]}} _
	 */
	render({ id, ratings }) {
		const { container, bar } = this.#getRatingElements(id);
		if (!container || !bar) return;

		this.#updateRatingUI(container, bar, ratings);
	}

	/**
	 * 更新评分 (state.rating 中格式为 {id, ratings})
	 * @param {{ id: string, value: number }} param0
	 */
	update({ id, value }) {
		const { container, bar } = this.#getRatingElements(id);
		if (!container || !bar) return;

		// 在 state.ratings 中查找 id
		let ratingEntry = state.ratings.find((r) => r.id === id);

		if (!ratingEntry) {
			// 如果没有该 id，则创建一个新的评分记录
			ratingEntry = { id, ratings: [] };
			state.ratings.push(ratingEntry);
		}

		// 添加评分
		ratingEntry.ratings.push(value);

		// 更新 UI
		this.#updateRatingUI(container, bar, ratingEntry.ratings);
	}

	/**
	 * 查找评分相关的元素
	 * @param {string} id - 评分 ID
	 * @returns {{ container: HTMLElement | null, bar: HTMLElement | null }} - 返回找到的元素
	 */
	#getRatingElements(id) {
		// 找到评分容器
		const container = this.#ratingContainers.find((el) => el.dataset.id === id);
		if (!container) {
			console.warn('rating block not found');
			return { container: null, bar: null };
		}

		// 找到评分条
		const bar = container.querySelector('.ratingBar div');
		if (!bar) {
			console.warn('rating bar not found');
			return { container: null, bar: null };
		}

		return { container, bar };
	}

	/**
	 * 更新评分 UI
	 * @param {HTMLElement} container - 评分容器
	 * @param {HTMLElement} bar - 评分条
	 * @param {number[]} ratings - 评分数组
	 */
	#updateRatingUI(container, bar, ratings) {
		const avg = Rating.calcAvg(ratings);
		container.querySelector('.rating').innerHTML = `${avg}`;
		this.#renderBar(bar, avg);
	}

	/**
	 * 渲染彩色小条
	 * @param {Element} ratingBar
	 * @param {Number} ratingValue
	 */
	#renderBar(ratingBar, ratingValue) {
		ratingBar.style.width = `${ratingValue}%`;
>>>>>>> 64ce306 (Websocket Version (v2.0.0))

    if (ratingValue < 60) ratingBar.classList.add("red");
    else if (ratingValue < 80) ratingBar.classList.add("yellow");
    else ratingBar.classList.add("green");
  }
}

// 表单

class InputView {
  #form = document.querySelector("form.chat-input");
  #inputEl = this.#form.querySelector(".input--textarea");
  #userEl = this.#form.querySelector(`input[name="user"]`);

<<<<<<< HEAD
  constructor() {
    this.#userEl.value = state.user;
  }
  /**
   * 文本输入时执行传入的函数
   * @param {function} eventListener
   */
  onsubmit(eventListener) {
    /** @param {Event} e  */
    const handler = function (e) {
      e.preventDefault();
      eventListener(this.inputMessage);

      // 存储用户名至 localStorage
      localStorage.setItem("user", this.inputMessage.user);
      console.log(`Hello, u: ${this.inputMessage.user}`);
    };
    this.#form.addEventListener("submit", handler.bind(this));
  }

  clearAll() {
    this.#inputEl.value = "";
  }

  get inputMessage() {
    const data = new FormData(this.#form);
    const obj = Object.fromEntries(data.entries());
    return new Message(obj);
  }
=======
	/**
	 * 文本输入时执行传入的函数
	 * @param {function} eventListener
	 */
	oninput(eventListener) {
		const handler = function (e) {
			e.preventDefault();
			eventListener(this.inputMessage);
		};
		this.#form.addEventListener('submit', handler.bind(this));
	}

	/**
	 * 清空输入框
	 */
	clear() {
		this.#inputEl.value = '';
	}

	/**
	 * 获取输入的消息
	 * @returns {Message} 消息对象
	 * */
	get inputMessage() {
		const data = new FormData(this.#form);
		const obj = Object.fromEntries(data.entries());
		return new Message(obj);
	}
>>>>>>> 64ce306 (Websocket Version (v2.0.0))
}

// 时间
class Time {
  #timeElememt = document.querySelector("#time");
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
export const replyView = new ReplyView();
new Time();
export const ratingsView = new RatingsView();
