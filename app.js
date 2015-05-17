var express = require('express');
var app = express();
var httpServer = require('http').Server(app);
var io = require('socket.io').listen(httpServer);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());

httpServer.listen(8080, function(req,res){
  console.log('Server started at port 8080');
});

var users = [];
var rooms = [];

io.on('connection', function (socket) {

  console.log("user connected!");

  socket.on('create the room', function (data) {
  	console.log("User " + data.userName + " created room!");
  	socket.userName = data.userName;
  	users[data.userName] = data.userName;

  	socket.join(data.roomName);
  });

  socket.on('join the room', function (data) {
  	console.log("User " + data.userName + " joined room!");
  	socket.userName = data.userName;
  	users[data.userName] = data.userName;

  	for(var i = 0; i < rooms.length; i++) {
  		if(rooms[i].roomName == data.roomName) {
  			rooms[i].participants.push(data.userName);
  			console.log(rooms);
  		}
  	}
  	socket.join(data.roomName);
  });

  socket.on('send message', function (data) {
  	io.sockets.in(data.roomName).emit('send message', { userName : socket.userName, message : data.message });
  });

   socket.on('disconnect', function () {
  	console.log("User " + socket.userName + " disconnected!");
  });
});

app.get('/rooms', function (req, res) {
	console.log('GET method from request!');
	res.json(rooms);
});

app.post('/rooms', function (req, res) {
	console.log(req.body);
	rooms.push({ roomName : req.body.roomName, creator: req.body.userName, participants: [] });
	res.json(rooms);
});