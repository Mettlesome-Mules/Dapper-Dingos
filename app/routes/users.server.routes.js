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


	// #DD establish io server for chat
	var server = http.createServer(app);
	var io = socketio.listen(server);

	app.set('socketio', io);
	app.set('server', server);
	// #DD create Schema for messages
	var chatMessage = new mongoose.Schema({
		username: String,
		message: String
	});
	// #DD define a model based on that SCHEMA, currently independant of users
	var Message = mongoose.model('Message', chatMessage)

	// #DD write a route for the clientside posts to DB
	app.route('/message').post( function (req, res) {

		var message = new Message ({
			username: req.body.username,
	    	message : req.body.message
	    });

	    message.save(function (err, saved) {
	    	if (err) {
	    		res.send(400);
	    		return console.log('error saving to db');
	    	}
	    	console.log(saved)
	    	res.send(saved);
	    	io.sockets.emit('receiveMessage', saved);
	    })
	});
	// #DD write a route for the clientside gets from DB
	app.route('/message').get(function (req, res) {
		Message.find(function (err, allMessages) {
	  	if (err) {
	  		return res.send(err);
	  	};
	  	res.send(allMessages);
	  })
	});


	//#DD setting up the chat messenger routing
	// app.route('/message').get(users.messages)

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
