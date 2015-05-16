var express = require('express');
var app = express();
var httpServer = require('http').Server(app);
var io = require('socket.io').listen(httpServer);

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

httpServer.listen(8080, function(req,res){
  console.log('Server started at port 8080');
});

io.on('connection', function (socket) {
  var userNameFlag = false;

  console.log("user connected!");

  socket.on('init', function (name) {
  	console.log("User " + name + " started chatting!");
  	socket.name = name;
  });

  socket.on('disconnect', function () {
  	console.log("User " + socket.name + " disconnected!");
  });

  socket.on('send message', function (message) {
  	console.log("chat : " + message);
  	// socket.broadcast.emit('send message', { name : socket.name, message : message });
  	io.emit('send message', { name : socket.name, message : message });
  });
});