'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	User = require('mongoose').model('User'),
	path = require('path'),
	config = require('./config');
	
/**
 * Module init function.
 */
module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-salt -password', function(err, user) {
			done(err, user);
		});
	});

	// Initialize strategies
	//#DD: As only Google auth strategy is being used, had to explicitly include it and local.js files
	//#DD: All other strategies have been removed from App/Config/Strategies
	//#DD: Express.js file was also edited to facilitate this
	//#DD: Test.js, secure.js, development.js, and production.js were also modified
	config.getGlobbedFiles('./config/strategies/**/google.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
	config.getGlobbedFiles('./config/strategies/**/local.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};