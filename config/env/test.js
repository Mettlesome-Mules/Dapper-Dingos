'use strict';

module.exports = {
	db: 'mongodb://localhost/dapper-dingos-test',
	port: 3001,
	app: {
		title: 'Dapper-Dingos - Test Environment'
	},
	//#DD: Tests for Facebook, Twitter, Linked In, and Github have been removed
	//#DD: These authorization stratgies were not utilized in the project
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
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
