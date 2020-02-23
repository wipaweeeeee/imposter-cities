const cv = require('opencv4nodejs');
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const wCap = new cv.VideoCapture("rtsp://imposter:Iw0rkfrog@10.0.0.15:554/Streaming/Channels/101/httpPreview.asp");

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

setInterval(() => {
    const frame = wCap.read();
    const image = cv.imencode('.jpg', frame).toString('base64');
    io.volatile.emit('image', image);
}, 1000 / 60)

server.listen(3002);