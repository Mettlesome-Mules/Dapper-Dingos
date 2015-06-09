'use strict';

angular.module('core')

.controller('mainController', ['$scope', 'Menus', function($scope, Menus) {
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.ytQuery = '';
    var socket = io.connect();
    $scope.socketTest = function() {
      console.log('socketTest button pressed')
      socket.emit('sendRooms');
    };
    socket.on('sendingRooms', function(rooms) {
      $scope.rooms = rooms
    })
    //#DD input box function for taking the submitted string and parsing into a videoKey.
    $scope.ytSearcher = function(){

      var video_id = $scope.ytQuery.split('v=')[1];
      console.log(video_id, $scope.ytQuery)
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

	}])

//create youtube helper functions for sockets and functionality #DD
.factory('youtubeFactory', function(){
	return {

	    onPlayerStateChange: function(event){
	    	
	    	var socket = io.connect();
	    	
	// If player is Playing #DD
			if (event.data === 1 && !window.hold) {
				window.hold = true;
				console.log('Youtube object: ' + JSON.stringify(window.j))
				console.log(event)
				socket.emit('initiate', console.log('sending that its time to play!'));	
			}

	//If Player is paused #DD
			if (event.data === 2 && !window.hold) {
				window.hold = true;
				console.log('paused')
				socket.emit('paused', console.log('sending that video has been paused!'));
				}
			},

			onPlayerReady: function(event){
		   	console.log('player ready')
		}
	}
})

//create youtube directive/tag for HTML #DD, THIS IS THE MAGIC!
.directive('youtube', 
	function($window, youtubeFactory) {
	  return {
	    restrict: "E",

	    scope: {
      		height:   "@",
      		width:    "@",
      		videoId:  "@"  
    	},

	    template: '<div></div>',

	    link: function(scope, element, attrs) {
	      window.j = attrs;
	      var tag = document.createElement('script');
	      tag.src = "https://www.youtube.com/iframe_api";
	      var firstScriptTag = document.getElementsByTagName('script')[0];
	      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	      var player;
	      var socket = io.connect();

	      // #DD socket trigger for Starting Vid
	      socket.on('startVid', function(){
    			console.log('startingVid')
    			player.playVideo();
    			window.hold = false;
    			console.log('playing video')
 				});

	      // #DD socket trigger for Pausing Vid
	      socket.on('pauseVid', function(){
    			console.log('pausingVid')
    			player.pauseVideo();
    			window.hold = false;
    			console.log('stopping video')
 				});

	      // #DD socket trigger for Changing Videotime
 				socket.on('changeTime', function(newTime){
 					console.log('changingTime');
 					player.seekTo({seconds:newTime, allowSeekAhead:true})
 					window.hold = false;
 				})

	      // #DD socket trigger for changing URL
				socket.on('changeVid', function(urlKey){
					console.log('changing video Url')
					// #DDyoutube API function for cueing new video
					player.cueVideoByUrl({ mediaContentUrl: 'http://www.youtube.com/v/' + urlKey + '?version=5'})
					console.log('loading new Url')
				})

	      $window.onYouTubeIframeAPIReady = function() {
	        player = new YT.Player(element.children()[0], {

		        playerVars: {
	            autoplay: 0,
	            html5: 1,
	            theme: "light",
	            modesbranding: 0,
	            color: "white",
	            iv_load_policy: 3,
	            showinfo: 1,
          		controls: 1,
          		start: 0
         	  },
          	  height: scope.height,
              width: scope.width,
              videoId: 'AXwGVXD7qEQ',
              events: {
              	'onReady': youtubeFactory.onPlayerReady,
              	'onStateChange': youtubeFactory.onPlayerStateChange
              }
       		});
	      };
	    },  
	  }
	});

