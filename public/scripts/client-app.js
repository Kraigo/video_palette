navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
if (!navigator.getUserMedia) {
    alert('You browser no support WebCamera api');
}
navigator.getUserMedia({
    audio: false,
    video: {
        width: { max: 320 },
        height: { max: 320 }
    }
}, onSuccessMedia, onFailedMedia);

var socket = io();
var video = document.querySelector('video');
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

var streams = [];
var userstreamContainer = document.getElementById('userstream-container');

function onSuccessMedia(stream) {
    video.src = window.URL.createObjectURL(stream);
}

function onFailedMedia() {

}

function snapShot() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/webp');
}

function addStream(id) {
    var streamItem = {
        id: id,
        image: document.createElement("img")
    };
    var userstreamPic = document.createElement('div');
    userstreamPic.appendChild(streamItem.image);
    userstreamPic.className = 'userstream-pic';

    userstreamContainer.appendChild(userstreamPic);
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
            userstreamContainer.removeChild(streams[i].image.parentNode);
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