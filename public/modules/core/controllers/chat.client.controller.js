// #DD calls the core app module
angular.module('core')
// #DD Establish functionality for pressing the enter key
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
})
// #DD develop method to post methods to server and DB
.factory('MessageFactory', ['$http', function ($http){
	return {
		postMessage: function (message, callback) {
			console.log('Attempting Post')
			$http.post('/message', message)
			.success(function(data, status){
				callback(data, false);
			}).
			error(function(data, status) {
				callback(data, true);
			});
		}
	} 
}])

//#DD controller interface for user chat window, need to change userName to current authed user
.controller('chatController', ['$scope','Authentication', 'MessageFactory', function ($scope, Authentication, MessageFactory) {
	$scope.userName = Authentication.user;
	$scope.message = '';
	$scope.filterText = '';
	$scope.messages = [];

	var socket = io.connect();
	// #DD load previous messages from chat
	socket.on('pastMessages', function (data) {
		// console.log(data, 'past')
		$scope.messages = data.reverse();
		// data.forEach(function (message) {
		// 	$scope.messages.unshift(message);
		// })
		$scope.$apply();
	});



	//#DD using the local authentication as a condition, send a message to the server
	$scope.sendMessage = function () {
		console.log("Send message event triggered", $scope.userName)

		var chatMessage = {
			'username' : $scope.userName.username,
			'message' : $scope.message
		};

		socket.emit('newMessage',chatMessage);
		$scope.message = '';
		};

		socket.emit('getUsers')
}]);
