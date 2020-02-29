const cv = require('opencv4nodejs');
const cors = require('cors');
const express = require('express');
const path = require('path');
const settings = require('./global.json');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { grabFrames, drawRectAroundBlobs } = require('./utils');

// Settings
const PORT = settings.Server.settings.port;
const DEVELOPMENT_MODE = false;
const wCap = DEVELOPMENT_MODE? new cv.VideoCapture(0) : new cv.VideoCapture(settings.Camera.stream.source);

const bgSubtractor = new cv.BackgroundSubtractorMOG2();
let numBlob;

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
    let blobs_count = grabFramesHelper(frameOpt);
    const image = cv.imencode('.jpg', frameOpt).toString('base64');
    DEVELOPMENT_MODE && console.log(byteCount(image))
    io.volatile.emit('data', {image: image, numBlob: numBlob});
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

function grabFramesHelper(frame){
  const foreGroundMask = bgSubtractor.apply(frame);

  const iterations = 1;
  const dilated = foreGroundMask.dilate(
    cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(4, 4)),
    new cv.Point(-1, -1),
    iterations
  );
  const blurred = dilated.blur(new cv.Size(10, 10));
  const thresholded = blurred.threshold(200, 255, cv.THRESH_BINARY);

  const minPxSize = 6000;
  numBlob = drawRectAroundBlobs(thresholded, frame, minPxSize);

  // cv.imshow('foreGroundMask', foreGroundMask);
  // cv.imshow('thresholded', thresholded);
  // cv.imshow('frame', frame);

  return numBlob;
}