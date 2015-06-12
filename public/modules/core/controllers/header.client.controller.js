'use strict';

// #DD This is necessary to keep the navigation bar on the top of the page workign

angular.module('core')
.controller('HeaderController', ['$scope', '$http', 'Authentication', 'Menus', function($scope, $http, Authentication, Menus) {
	$scope.authentication = Authentication;
	$scope.isCollapsed = false;
	$scope.menu = Menus.getMenu('topbar');
	$scope.currentRoom;
	$scope.roomname;
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
	socket.emit('sendRooms')
	socket.on('sendingRooms', function(rooms) {
      $scope.rooms = rooms
      console.log('header.client.controller.js: socket.on.sendingRooms: rooms', rooms)
    })

	$scope.changeRoom = function(roomname) {
		console.log('header.client.controller.js: $scope.changeRoom: roomname',roomname)
		// emits pastMessages
		console.log('header.client.controller.js: $scope.changeRoom: socket.emit("changeRoom")',roomname)
		$scope.roomname = roomname

		console.log('WE NEED TO UPDATE THE VIDEO SOME HOW!???',$scope.rooms)
		for(var i = 0;i < $scope.rooms.length;i++){
			if ($scope.rooms[i].name === roomname){
				$scope.currentRoom = $scope.rooms[i]
			}
		}
		console.log('CURRENT ROOMM IS HERE NOW CHANGE THE VIDEO ALREADY', $scope.currentRoom)
		socket.emit('changingUrl', $scope.currentRoom.queue[0].id.videoId)


		var room = {
		'admin': 'guest',
		'name': roomname
		};
		socket.emit('changeRoom', room)

	};

	$scope.createRoom = function(roomname) {
		console.log('header.client: createRoom():',roomname)
		$scope.roomname = roomname
		// socket.emit('newRoom', roomname)
		var room = {
		  'admin': 'guest',
		  'name': roomname
		};
		console.log('header.client: createRoom():Emit newRoom: room', room)
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
			console.log(video.id.videoId)
			console.log('urlEmit', video.id.videoId)
			var socket = io.connect();
			socket.emit('changingUrl', video.id.videoId)
			console.log('AFTER CHANGED VIDEO URL')
			socket.emit('addToQueue', video, $scope.roomname)
			console.log('AFTER ADDTOQUEUE')
		}
		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
