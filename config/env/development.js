'use strict';
// #DD - added the url for our mongolab hosted database
module.exports = {
	db: 'mongodb://mettle:neighneigh@ds045242.mongolab.com:45242/socket2me',
	app: {
		title: 'Dapper-Dingos - Development Environment'
	},
	//#DD: Entries for Facebook, Twitter, Linked In, and Github have been removed
	//#DD: These authorization stratgies were not utilized in the project
	google: {
		clientID: process.env.GOOGLE_ID || '514791028469-vtvgnb6evriqu757ph87gvf74crkfcv6.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'Dvn7XJenZSfsQV9YcgLmhdBN',
		callbackURL: '/auth/google/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
