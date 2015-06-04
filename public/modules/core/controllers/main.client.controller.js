'use strict';

angular.module('core').controller('mainController', ['$scope', 'Menus',
	function($scope, Menus) {
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
	}

])
//create youtube helper functions for sockets and functionality #DD
.factory('youtubeFactory', function(){
	return {
	    onPlayerStateChange: function(event){
	    	
	    	var socket = io.connect();

	// If player is Playing #DD
			if (event.data === 1) {
				console.log('Youtube object: ' + JSON.stringify(window.j))
				console.log('playing')
				console.log(event)
				socket.emit('initiate player', videoPlay());


				// socket.broadcast('Initiate Player')

				// function videoPlay() {
				// 	player.videoPlay
				// 	console.log('working')
				// }

				socket.on('Initiate Player', videoPlay())
					
			}

	//If Player is paused #DD
			if (event.data === 2) {
				console.log('paused')
				}
			},
	//

		   onPlayerReady: function(event){
		   	console.log('player ready')
		}
	}
})
//create youtube directive/tag for HTML #DD
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
	      //var searchVideos;

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
         	  },
          	  height: scope.height,
              width: scope.width,
              videoId: 'AXwGVXD7qEQ', //set to searchVideos
              events: {
              	'onReady': youtubeFactory.onPlayerReady,
              	'onStateChange': youtubeFactory.onPlayerStateChange
              }
       		});
	      };
	    },  
	  }
	});		
