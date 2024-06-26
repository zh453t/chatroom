export default {
	port: 2,
	hostname: 'localhost',

	endpoints: {
		message: '/api/messages',
		rating: '/api/ratings',
		reply: '/api/reply',
	},

	dirs: {
		msgData: './pub/database/messages.json',
		ratingsData: './pub/database/ratings.json',
		repliesData: './pub/database/replies.json',
	},
};
