'use strict';

// #DD This is necessary to keep the navigation bar on the top of the page workign

angular.module('core')
.controller('HeaderController', ['$scope', '$http', 'Authentication', 'Menus', function($scope, $http, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.rooms;
		$scope.room_search;
		$scope.video_search_text = '';
		$scope.video_search_results = [];
		$scope.video_search_focus = false;
		$scope.clearSearch = function(e){
			console.log('CLEAR SEARCH',e)
			$scope.video_search = "";
			$scope.video_results = "";

		}

		socket.on('updatechat', function(rooms) {
      $scope.rooms = rooms
    })

		$scope.changeRoom = function(roomname) {
      console.log(roomname, '<-CHANGING TO')
		  socket.emit('changeRoom', roomname)
		  var room = {
		    'admin': '',
		    'name': roomname
		  };
		  socket.emit('newRoom', room);      
		};

		$scope.createRoom = function(roomname) {
			console.log(roomname)
			socket.emit('switchRoom', roomname)
			var room = {
			  'admin': '',
			  'name': roomname
			};
			socket.emit('newRoom', room);   
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
					q: $scope.video_search_text,

				}
			})
			.success(function(data) {
				console.log('mainctrl', data.items[0].id.videoId);
				$scope.video_search_results = data.items;
				console.log('mainctrl.succes', $scope.video_search_results)
			})
			.error(function () {
				console.log('err')
			})
		},
		$scope.urlEmit = function(video) {
			console.log('urlEmit', video.id.videoId)
			var socket = io.connect();
			socket.emit('changingUrl', video.id.videoId)
			console.log('AFTER CHANGED VIDEO URL')
			socket.emit('addToQueue', video, 'RoomNameHere')
			console.log('AFTER ADDTOQUEUE')
		}
		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
		$scope.queue = function() {
			
		}

	}
]);
