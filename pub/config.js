export default {
	port: {
		http: 89,
		websocket: 899,
	},
	hostname: 'localhost',
	secure: false,

	dirs: {
		static: './pub',
		message: './pub/database/messages.json',
		rating: './pub/database/ratings.json',
		reply: './pub/database/replies.json',
	},

	get protocols() {
		return {
			http: this.secure ? 'https' : 'http',
			websocket: this.secure ? 'wss' : 'ws',
		};
	},
};
