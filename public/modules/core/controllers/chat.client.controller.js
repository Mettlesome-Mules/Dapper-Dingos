// #DD calls the core app module
angular.module('core')
// #DD Establish functionality for pressing the enter key
.directive('ngEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keypress", function (event) {
			if (event.which === 13) {
				scope.$apply(function () {
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	};
})

// #DD develop method to post methods to server and DB
.factory('MessageFactory', ['$http', function ($http) {
	return {
		postMessage: function (message, callback) {
			console.log('Attempting Post');
			$http.post('/message', message)
			.success(function (data, status) {
				callback(data, false);
			}).
			error(function (data, status) {
				callback(data, true);
			});
		}
	};
}])

//#DD controller interface for user chat window, need to change userName to current authed user
.controller('chatController', ['$scope', 'Authentication', 'MessageFactory', function ($scope, Authentication, MessageFactory) {
	$scope.userName = Authentication.user;
	$scope.message = '';
	$scope.filterText = '';
	$scope.messages = [];
	$scope.roomname = '';
	var socket = io.connect();

    // #DD load previous messages from chat
  socket.on('pastMessages', function (pastMessages) {
  	console.log('chat.client.controller.js: socket.on("pastMessages": arguments"', pastMessages);
  	$scope.messages = pastMessages.reverse()
    $scope.$apply();
  });


    //#DD using the local authentication as a condition, send a message to the server
  $scope.sendMessage = function () {
    var chatMessage = {
      'username': $scope.userName.displayName,
      'message': $scope.message
    };
  	$scope.messages.unshift(chatMessage)
  	console.log("chat.client.controller.js: $scope.sendMessage: Send message event triggered", chatMessage);

  	socket.emit('newMessage', chatMessage);

  	console.log("chat.client.controller.js: Emit newMessageevent")
  	$scope.message = '';
  };
  // socket.emit('onload');
}]);