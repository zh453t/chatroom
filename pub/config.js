export default {
	port: {
		http: 89,
		websocket: 899,
	},
	hostname: 'localhost',

	dirs: {
		static: './pub',
		message: './pub/database/messages.json',
		rating: './pub/database/ratings.json',
		reply: './pub/database/replies.json',
	},
};
