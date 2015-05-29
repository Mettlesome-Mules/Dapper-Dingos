'use strict';


angular.module('core').directive('youtube', 
	function($window) {
	  return {
	    restrict: "E",


	    scope: {
      		height:   "@",
      		width:    "@",
      		videoId:  "@"  
    	},

	    template: '<div></div>',

	    link: function(scope, element, attrs) {
	      var tag = document.createElement('script');
	      tag.src = "https://www.youtube.com/iframe_api";
	      var firstScriptTag = document.getElementsByTagName('script')[0];
	      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	      var player;

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
              videoId: 'QH2-TGUlwu4'
       		});
	      };
	    },  
	  }
	});