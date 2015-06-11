'use strict';

// #DD This is necessary to keep the navigation bar on the top of the page workign

angular.module('core')
.controller('HeaderController', ['$scope', '$http', 'Authentication', 'Menus', function($scope, $http, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.rooms = ['room1','room2','bigroom3','smallroom4'];
		$scope.room_search;
		$scope.video_search = [];
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
		// $scope.searchYouTube = function(e){
		// 	console.log($scope.video_search)
		// 	// If youtube exists in the string then emit event
		// 	if ($scope.video_search.indexOf("youtube") > -1){
		// 		var video_id = $scope.video_search.split('v=')[1];
		// 		console.log(video_id, $scope.video_search)
		// 			if(video_id.indexOf('&') !== -1) {
		// 			var ampersandPosition = video_id.indexOf('&');
		// 			  video_id = video_id.substring(0, ampersandPosition);
		// 			} else {
		// 			  video_id = video_id.substring(0, video_id.length);
		// 			}
					
		// 			var socket = io.connect();
		// 			// #DD triggers url change via sockets, sends videoID as data
		// 			socket.emit('changingUrl', video_id)
		// 	}
		// 	$scope.video_results = ['abc','123','456']
		// }
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};
		$scope.searchYouTube = function() {
			console.log('mainctrl searching')
			$http({
				method: 'GET',
				url: 'https://www.googleapis.com/youtube/v3/search',
				params: {
					key: 'AIzaSyBU7VNaj493eV7o9dEu06kWLvQuxU4usrs',
					type: 'video',
					maxResults: '10',
					part:'id, snippet',
					fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
					q: this.query

				}
			})
			.success(function(data) {
				console.log('mainctrl', data.items[0].id.videoId);
				$scope.searches = data.items;
				console.log('mainctrl.succes', $scope.searches)
				// var socket = io.connect();

				// socket.emit('changingUrl', data.video_id)
			})
			.error(function () {
				console.log('err')
			})
		},

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

	}
]);
