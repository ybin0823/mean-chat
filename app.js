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
  var addedUser = false;

  console.log("user connected!");

  socket.on('init', function (userName) {
  	console.log("User " + userName + " started chatting!");
  	socket.userName = userName;
  	users[userName] = userName;
  	addedUser = true;
  });

  socket.on('disconnect', function () {
  	console.log("User " + socket.userName + " disconnected!");
  });

  socket.on('send message', function (message) {
  	console.log("chat : " + message);
  	// socket.broadcast.emit('send message', { name : socket.name, message : message });
  	io.emit('send message', { userName : socket.userName, message : message });
  });
});

app.get('/rooms', function (req, res) {
	console.log('GET method from request!')
	res.json(rooms);
});

app.post('/rooms', function (req, res) {
	console.log(req.body);
	rooms.push({ roomName : req.body.roomName, creator: req.body.userName })
	console.log(rooms);
	res.json(rooms);
});