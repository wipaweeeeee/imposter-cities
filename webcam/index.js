const cv = require('opencv4nodejs');
const express = require('express');
const path = require('path');
const cors = require('cors');
const settings = require('./global.json');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { grabFrames, drawRectAroundBlobs } = require('./utils');

io.set('origins', 'http://10.119.93.137:1234');


// const wCap = new cv.VideoCapture("rtsp://imposter:Iw0rkfrog@10.0.0.15:554/Streaming/Channels/101/httpPreview.asp");
// const wCap = new cv.VideoCapture('./green_live.MOV');

const bgSubtractor = new cv.BackgroundSubtractorMOG2();

const makeContours = (img) => {
	const mode = cv.RETR_LIST;
  	const method = cv.CHAIN_APPROX_SIMPLE;

 	const contours = img.findContours(mode, method);
 	// console.log(contours)

 	return contours.sort((c0, c1) => c1.area - c0.area)[0];
}

grabFrames('./green_live.MOV', 50, (frame) => {
	// const foreGroundMask = bgSubtractor.apply(frame);

 //  const iterations = 2;
 //  const dilated = foreGroundMask.dilate(
 //    cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(4, 4)),
 //    new cv.Point(-1, -1),
 //    iterations
 //  );
 //  const blurred = dilated.blur(new cv.Size(10, 10));
 //  const thresholded = blurred.threshold(200, 255, cv.THRESH_BINARY);

 //  const minPxSize = 40;
 //  drawRectAroundBlobs(thresholded, frame, minPxSize);

 	const resizedImg = frame.resizeToMax(640);
 	const newFrame = frame.cvtColor(cv.COLOR_BGR2GRAY);
 	const bodyContour = makeContours(newFrame);
 	const coutourPoints = bodyContour.getPoints();

 	if (!bodyContour) {
 		return;
 	}

 	const blue = new cv.Vec(255, 0, 0);
 	const showContour = frame.drawContours([coutourPoints], 0, blue, { thickness: 2})
 	const result = resizedImg.copy();
 	const { rows, cols } = result;

 	const plzDraw = new cv.Mat(rows, cols *2, cv.CV_8UC3);
 	result.copyTo(plzDraw.getRegion(new cv.Rect(0,0,cols,rows)));

  // cv.imshow('foreGroundMask', foreGroundMask);
  // cv.imshow('thresholded', thresholded);
  cv.imshow('result', plzDraw);
  cv.imshow('frame', frame);


})

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