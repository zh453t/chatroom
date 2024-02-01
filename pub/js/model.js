// ratAll ==> All Ratings, 所有的评分 // 形式: [{id, rating}, ...]
// rating 单个评分

import { getJSON, postJSON } from "./helpers.js";
export const state = {
  messages: [],
  get ids() {
    return this.messages.map((m) => m.id);
  },

  ratings: [],
  get filteredRatings() {
    return this.ratings.filter((r) => {
      return !this.wasteIDs.some((id) => id === r.id);
    });
  },

  /**
   * 设置新的评分，会在 controller.js 里被调用
   * @param {Object} _
   * @param {number} _.id
   * @param {number[]} _.rating
   */
  set newRating({ id, rating }) {
    // 如果 id 已存在，则追加，如果不存在则创建
    const index = this.ratings.findIndex((u) => u.id === id);
    // 🔼 找到id的位置
    if (index === -1) {
      // 新建
      this.ratings.push({ id, rating: [rating] });
    } else {
      // 追加
      this.ratings[index].rating.push(rating);
    }
  },

  setNewRatingsCopy({ id, rating }) {
    // 如果 id 已存在，则追加，如果不存在则创建
    // 深拷贝
    const ratAll = Object.assign({}, this.ratings);
    const index = ratAll.findIndex((u) => u.id === id);
    // 🔼 找到id的位置
    if (index === -1) {
      // 新建
      ratAll.push({ id, rating: [rating] });
    } else {
      // 追加
      ratAll[index].rating.push(rating);
    }
    return ratAll;
  },
  wasteIDs: [],
};

/**
 * 和 state 里面的 messages 比对，如果一样就返回null⬇️
 * @returns {Promise<array>}
 */
export async function getMessage() {
  const messages = await getJSON("./database/messages.json");

  if (state.messages === messages) return null;

  state.messages = messages;
  return messages;
  // 这是一个数组，包含所有messag1es对象Object { text: "？", time: "2023-09-09 17:57:48" }
}

/**
 * 发送文字信息
 * @param {{content: string, user: string, id: string}} message
 */
export function sendMessage(message) {
  postJSON("./api/messages", message);
}

// -------- 评分 ------------- //

export async function getRatings() {
  const res = await fetch("./database/ratings.json");
  const ratings = await res.json();
  state.ratings = ratings;
  return ratings;
}

/**
 * 发送新的评分， newRating 是一个 Setter, 会在ratings里追加 { id, rating }
 * @param {{id: string, rating: num[]}} rating
 */
export function sendRatings(rating) {
  state.newRating = rating;
  const ratings = state.wasteIDs ? state.filteredRatings : state.ratings;
  postJSON("./api/ratings", ratings);
}

// --------- 回复 ---------- //
export function sendReply(reply) {
  console.log(reply)
  postJSON("./api/reply", reply)
}
export async function getReply() {
  const replies = await getJSON("./database/replies.json")
  return replies
}
