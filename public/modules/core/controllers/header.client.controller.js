'use strict';

// #DD This is necessary to keep the navigation bar on the top of the page workign

angular.module('core')
.controller('HeaderController', ['$scope', '$http', 'Authentication', 'Menus', function($scope, $http, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
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
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};
		$scope.searchYouTube = function() {
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
				console.log('fullVideo',data)
				console.log('mainctrl', data.items[0].id.videoId);
				$scope.video_search_results = data.items;
				console.log('mainctrl.succes', $scope.video_search_results)
			})
			.error(function () {
				console.log('err')
			})
		},
		$scope.urlEmit = function(video) {

			var socket = io.connect();
			socket.emit('changingUrl', video.id.videoId)
			// console.log('AFTER CHANGED VIDEO URL')
			socket.emit('addToQueue', video, 'RoomNameHere')
			// console.log('AFTER ADDTOQUEUE')
		}
		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
