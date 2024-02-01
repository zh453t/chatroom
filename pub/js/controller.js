"use strict";
import * as model from "./model.js";
import * as views from "./views.js";
import * as helpers from "./helpers.js";

console.info(`v${helpers.config.version}`);
// -------------------------- //

// 这些事 controller 中特有的函数，这些都绑定到了 views.js 里的事件监听器上，详见最后几行

// 1.1 获取消息 (fetch)
const fetchMsg_C = () => {
  model
    .getMessage()
    .then((messages) => {
      // 0. Guard clause
      if (!messages) throw new Error("no messages!");

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
 * @param {Map<string,any>} inputMessage
 */
const sendMsg_C = function (inputMessage) {
  // 1. 检查
  if (!helpers.hasEmptyValues(inputMessage)) {
    alert("用户名或消息不能为空 ");
    return;
  }
  // console.log("FormData:", inputMessage);

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
    .then(() => {
      model.state.ratings.forEach((rating) => {
        views.ratingsView.render(rating);
      });
    })
    .catch(console.error);
};

// 4.2 发送评分
const sendRatings_C = (id) => {
  const rating = parseInt(prompt("给出你的评分"));

  // 检查评分是否合规
  if (!helpers.isRatingValid(rating)) return;

  model.sendRatings({ id, rating });
  fetchRatings_C();
};

// ---------- 5 回复 --------- //

const fetchReply_C = () => {
  // views.chatView.clearReply(reply.for)
  model.getReply().then((replies) => {
    const ids = new Set(replies.map((v) => v.for));
    ids.forEach((id) => views.chatView.clearReply(id));

    replies.forEach((reply) => {
      views.chatView.renderReply(reply);
    });
  });
};

const sendReply_C = (id) => {
  const content = prompt("回复：");
  if (!content) return;
  model.sendReply({
    for: id,
    content,
    time: Date.now(),
  });
  fetchReply_C();
};
// ------- 结束 ----------- //

// views.chatView.clearBtnOnclick(pwdCtrl);
views.inputView.oninput(sendMsg_C);
views.ratingsView.onclick(sendRatings_C);
views.chatView.onreply(sendReply_C);
fetchMsg_C();
