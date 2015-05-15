var express = require('express');
var app = express();
var http = require('http');

app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

var httpServer = http.createServer(app).listen(8080, function(req,res){
  console.log('Socket IO server has been started');
});
// upgrade http server to socket.io server
var io = require('socket.io').listen(httpServer);

io.on('connection', function (socket) {
  console.log("user connected!");
});