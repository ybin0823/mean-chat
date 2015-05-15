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
  console.log("user connected!");
});