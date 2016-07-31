var express = require('express');
var app = new express();
var http = require('http').Server(app);

var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.get('/', function(res, req) {
    res.redirect('index.html')
})

io.on('connection', function(socket) {

    var socketId = socket.id.replace('/#', '');

    socket.broadcast.emit('join', socketId);

    socket.on('stream', function(image) {
        socket.broadcast.emit('stream', {
            id: socketId,
            image: image
        });
    });

    socket.on('disconnect', function() {
        socket.broadcast.emit('leave', socketId);
    });
})

http.listen(port, function() {
    console.log('Server started at port: %s', port);
})