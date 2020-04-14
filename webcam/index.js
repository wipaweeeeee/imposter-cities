const fs = require('fs');
const cv = require('opencv4nodejs');
const cors = require('cors');
const express = require('express');
const path = require('path');
const settings = require('./global.json');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// const tf = require('@tensorflow/tfjs-node');
// const cocoSsd = require('@tensorflow-models/coco-ssd');

// Settings
const ASSET_FOLDER = './assets/';
const PORT = settings.Server.settings.port;
const DEVELOPMENT_MODE = true;
const USE_STOCK_IMAGE = true;
const wCap = DEVELOPMENT_MODE? new cv.VideoCapture(0) : new cv.VideoCapture(settings.Camera.stream.source);

//tensorflow

// const detectFrame = (video, model) => {
//   model.detect(video).then(predictions => {
//     console.log(predictions)
//   })
// }


// const modelPromise = cocoSsd.load().then(model => {

  // const img = wCap.read();
  // const img = cv.imread(wCap);

  // const size = new cv.Size(300, 300);
  // const vec3 = new cv.Vec(0, 0, 0);
  // const resizedImg = cv.blobFromImage(img, 1, size, vec3, true, true);
  // const height = img.sizes[0];
  // const width = img.sizes[0];
  // const numChannels = 3;

  // const values = new Int32Array(height * width * numChannels);
  // const outShape = [ height, width, numChannels];
  // const input = tf.tensor3d(values, outShape, 'int32');

  // console.log(img)

  // detectFrame(img, model)
// });


io.on('connection', function(socket){
	console.log('connection found')
});

function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}


setInterval(() => {
    const frame = wCap.read();
    const region = frame.getRegion(new cv.Rect(300, 200, 500, 400))
    // Optimization
    let frameOpt = region.resizeToMax(500);
    frameOpt = frameOpt.convertTo(cv.CV_64FC3);
    const image = USE_STOCK_IMAGE? fs.readFileSync(ASSET_FOLDER + 'pavillion_invert_mg.png').toString('base64') : cv.imencode('.jpg', frameOpt).toString('base64');

    // DEVELOPMENT_MODE && console.log(byteCount(image))
    io.volatile.emit('data', {image: image});
}, 1000 / 60)

app.use(cors());
app.use(express.static('assets'))
app.get('/', (req, res) => {
    res.cookie('foo', 'bar', {
        sameSite: true
      })
    res.sendFile(path.join(__dirname, 'index.html'));
})

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))
