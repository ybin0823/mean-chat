var chatApp = angular.module('chatApp', ['ngRoute']);
chatApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/', { templateUrl : 'partials/name.html' })
	.when('/rooms', { templateUrl : 'partials/rooms.html' })
	.when('/chat', { templateUrl : 'partials/chat.html' })
	.otherwise({ redirectTo: '/name.html' });
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
    	});
    }
}});

chatApp.controller('chatCtrl', function ($scope, socket) {
	$scope.chatList = [];

	$scope.sendMessage = function () {
		console.log($scope.message);

		socket.emit('send message', $scope.message);
    	$scope.message = '';
	}

	socket.on('send message', function (data) {
		$scope.chatList.push(data);
	});
});

chatApp.controller('nameCtrl', function ($scope, $rootScope, $location, socket) {
	$scope.startChat = function () {
		console.log($scope.userName);
		$rootScope.userName = $scope.userName;
		socket.emit('init', $scope.userName);
		$location.path('/rooms');
	}
});
	
chatApp.controller('roomCtrl', function ($scope, $http) {
	$http.get('/rooms').success(function (res) {
		console.log('Received rooms from server')
		$scope.rooms = res;
	})

	$scope.createRoom = function () {
		console.log($scope.roomName);
		$http.post('/rooms', { roomName : $scope.roomName, userName : $scope.userName }).success(function (res) {
			console.log(res);
			$scope.rooms = res;
		});
		$scope.roomName = '';
	}
});