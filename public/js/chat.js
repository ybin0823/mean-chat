var chatApp = angular.module('chatApp', ['ngRoute']);
chatApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/', {templateUrl : 'partials/name.html'})
	.when('/chat', {templateUrl : 'partials/chat.html'})
	.otherwise({redirectTo: '/name.html'})
}]);

chatApp.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

chatApp.controller('chatCtrl', function ($scope, socket) {
	$scope.messages = [];
	
	$scope.sendMessage = function () {
		console.log($scope.text);

		socket.emit('send message', $scope.text);
    	$scope.text = '';
	}

	socket.on('send message', function(message) {
		console.log('from server : ' + message);
		$scope.messages.push(message);
	});
});

chatApp.controller('nameCtrl', function ($scope, $location) {
	$scope.startChat = function () {
		console.log($scope.name);
		$location.path('/chat');
	}
});