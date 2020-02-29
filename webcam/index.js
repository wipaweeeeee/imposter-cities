const cv = require('opencv4nodejs');
const express = require('express');
const path = require('path');
const cors = require('cors');
const settings = require('./global.json');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Settings
const PORT = settings.Server.settings.port;
const DEVELOPMENT_MODE = false;
const wCap = DEVELOPMENT_MODE? new cv.VideoCapture(0) : new cv.VideoCapture(settings.Camera.stream.source);

io.on('connection', function(socket){
	console.log('connection found')
});

function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}

setInterval(() => {
    const frame = wCap.read();
    // Optimization
    let frameOpt = frame.resizeToMax(500);
    frameOpt = frameOpt.convertTo(cv.CV_64FC3);
    const image = cv.imencode('.jpg', frameOpt).toString('base64');

    DEVELOPMENT_MODE && console.log(byteCount(image))
    io.volatile.emit('image', image);
}, 1000 / 16)

app.use(cors());
app.use(express.static('assets'))
app.get('/', (req, res) => {
    res.cookie('foo', 'bar', {
        sameSite: true
      })
    res.sendFile(path.join(__dirname, 'index.html'));
})

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))