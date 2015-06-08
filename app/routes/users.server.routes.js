'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	socketio = require('socket.io'),
	http = require('http')





module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller');
	var mongoose = require('mongoose');

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);



	// #DD Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/youtube',
			'https://www.googleapis.com/auth/youtube.force-ssl',
			'https://www.googleapis.com/auth/youtube.readonly',
			'https://www.googleapis.com/auth/youtube.upload',
			'https://www.googleapis.com/auth/youtubepartner',
			'https://www.googleapis.com/auth/youtubepartner-channel-audit'
		]
	}));
	//#DD setting up the users oath authentication API
	app.route('/auth/google/callback').get(users.oauthCallback('google'));

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};
