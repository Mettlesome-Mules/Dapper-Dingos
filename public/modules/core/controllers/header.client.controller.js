'use strict';

// #DD This is necessary to keep the navigation bar on the top of the page workign

angular.module('core')
.controller('HeaderController', ['$scope', 'Authentication', 'Menus', function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.rooms = ['room1','room2','bigroom3','smallroom4'];
		$scope.room_search;
		$scope.video_search;
		$scope.video_search_focus = false;
		$scope.clearSearch = function(e){
			console.log('CLEAR SEARCH',e)
			$scope.video_search = "";
			$scope.video_results = "";

		}
		$scope.createRoom = function(roomName) {
			console.log('TODO: createRoom', roomName)
			$scope.rooms.push(roomName)
			$scope.room_search = '';
		}
		$scope.searchYouTube = function(e){
			console.log($scope.video_search)
			// If youtube exists in the string then emit event
			if ($scope.video_search.indexOf("youtube") > -1){
				var video_id = $scope.video_search.split('v=')[1];
				console.log(video_id, $scope.video_search)
					if(video_id.indexOf('&') !== -1) {
					var ampersandPosition = video_id.indexOf('&');
					  video_id = video_id.substring(0, ampersandPosition);
					} else {
					  video_id = video_id.substring(0, video_id.length);
					}
					
					var socket = io.connect();
					// #DD triggers url change via sockets, sends videoID as data
					socket.emit('changingUrl', video_id)
			}
			$scope.video_results = ['abc','123','456']
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
