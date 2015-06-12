'use strict';
// #DD - added the url for our mongolab hosted database
module.exports = {
	//db: 'localhost:27017/socket4me',
	db: 'mongodb://mettle:neighneigh@ds033617.mongolab.com:33617/lounger',
	app: {
		title: 'Lounger'
	},
	//#DD: Entries for Facebook, Twitter, Linked In, and Github have been removed
	//#DD: These authorization stratgies were not utilized in the project
	google: {
		clientID: process.env.GOOGLE_ID || '185307625644-ab2asrcg7pnj8pberl2680gtp04iidc3.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'uCVPruNEtIIo2zbobsa-fxuV',
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
