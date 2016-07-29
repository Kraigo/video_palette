var express = require('express');
var app = new express();
var http = require('http').Server(app);

var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.get('/', function(res, req) {
    res.redirect('index.html')
})

io.on('connection', function(socket) {
    socket.on('stream', function(image) {
        socket.broadcast.emit('stream', image);
    });

    ss(socket).on('video', function(stream, data) {
        // ss(socket).emit('youvideo', stream, data);
    })
})

http.listen(port, function() {
    console.log('Server started at port: %s', port);
})