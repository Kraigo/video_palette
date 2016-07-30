navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

navigator.getUserMedia({
    audio: false,
    video: {
        width: 420,
        height: 320
    }
}, onSuccessMedia, onFailedMedia);

var socket = io();
var video = document.querySelector('video');
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

var streams = [];

canvas.width = 420;
canvas.height = 320;

function onSuccessMedia(stream) {
    video.src = window.URL.createObjectURL(stream);
}

function onFailedMedia() {

}

function snapShot() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/webp');
}

function addStream(id) {
    var streamItem = {
        id: id,
        image: document.createElement("img")
    };
    document.body.appendChild(streamItem.image);
    streams.push(streamItem);
}

function updateStream(id, image) {
    for (var i = 0; i < streams.length; i++) {
        if (streams[i].id === id) {
            streams[i].image.src = image;
            return;
        }
    }
    // If stream not exist;
    addStream(id);
    updateStream(id, image);

}

function removeStream(id) {
    for (var i = 0; i < streams.length; i++) {
        if (streams[i].id === id) {
            streams[i].image.parentNode.removeChild(streams[i].image);
            streams[i].splice(i, 1);
            return;
        }
    }
}


setInterval(function() {
    socket.emit('stream', snapShot());

}, 1000 / 10);

socket.on('stream', function(stream) {
    updateStream(stream.id, stream.image);
});

socket.on('join', function(id) {
    console.log('Join %s', id);
    addStream(id);
});

socket.on('leave', function(id) {
    console.log('Leave %s', id);
    removeStream(id);
});