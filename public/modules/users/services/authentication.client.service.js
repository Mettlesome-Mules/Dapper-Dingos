'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var that = this;

		that._data = {
			user: window.user
		};

		return that._data;
	}
]);