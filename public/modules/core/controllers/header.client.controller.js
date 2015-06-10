'use strict';

// #DD This is necessary to keep the navigation bar on the top of the page workign

angular.module('core')
.controller('HeaderController', ['$scope', 'Authentication', 'Menus', function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.rooms = ['room1','room2','bigroom3','smallroom4'];
		$scope.room_search;
		$scope.createRoom = function(roomName) {
			console.log('TODO: createRoom', roomName)
			$scope.rooms.push(roomName)
			$scope.room_search = '';
		}
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
