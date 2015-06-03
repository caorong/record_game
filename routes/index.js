// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

var fs = require('fs');
var path = require('path');
var util = require('util');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.playvideo = function(req, res){
  res.render('playvideo', { title: 'Express' });
};

exports.recordaudio = function(req, res){
  res.render('recordaudio', { title: 'Express' });
};


exports.test = function(req, res){
  res.render('test', { title: 'Test page' });
};

// var morgan = require('morgan')
// var logger = morgan('combined')

var log4js = require('log4js');

log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.console()); 
log4js.addAppender(log4js.appenders.file('cheese.log'), 'cheese');
var logger = log4js.getLogger('cheese');
logger.setLevel('DEBUG');

// 请求的本地地址暂时写死
exports.resource = function(req, res) {
  // logger.info(req)
  // logger.info(req.query("fname"))
  logger.info(req.query.file)
  // logger.info(req.body);


  // logger(req, res, function (err) {
  //   if (err) return done(err)

  //   // respond to request
  //   res.setHeader('content-type', 'text/plain')
  //   res.end('hello, world!')
  // })
  
  var filePath = "/Users/caorong/Documents/workspace_node/record_game/assets/" + req.query.file;
  
  var s = fs.statSync(filePath);
  logger.info(s)
  /** http://stackoverflow.com/a/12900504/1015046  **/
  var ext = filePath.substr((Math.max(0, filePath.lastIndexOf(".")) || Infinity) + 1);

// http://stackoverflow.com/questions/2871631/seeking-not-working-in-html5-audio-tag
// web.ctx.status = "206 Partial Content"
// web.header("Content-Range", "bytes %d-%d/%d" % (start, end, total))
// web.header("Accept-Ranges", "bytes")
// web.header("Content-Length", chunksize)

  // https://gist.github.com/paolorossi/1993068
  if (ext == 'mp3') {
    res.set({
      'Content-Type': 'audio/mpeg',
      // 'Accept-Ranges': 'bytes',
      // 'Content-Range': util.format('bytes %d-%d/%d', 0, s.size-1, s.size),
      'Content-Length': s.size
    });
    var readStream = fs.createReadStream(filePath);
    // res.status(206);
    readStream.pipe(res);

  } else if (ext == 'mp4') {
    res.set({
      'Content-Type': 'video/mp4',
      'Content-Length': s.size
    });
    var readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } else if (ext == 'txt' || ext == 'log' || ext == 'json' || ext == 'md') {
    res.send(fs.readFileSync(filePath, 'UTF-8'));
  } else if (ext == 'png' || ext == 'jpeg' || ext == 'jpg') {
    res.end(fs.readFileSync(filePath), 'binary');
  } else {
    res.send('Hmmm.. Looks like this file cannot be played.');
  }
}

// TODO 问peter要
function streamfile(req ){
  if (req.headers['range']) {
    var range = req.headers.range;
    var parts = range.replace(/bytes=/, "").split("-");
    var partialstart = parts[0];
    var partialend = parts[1];
 
    var start = parseInt(partialstart, 10);
    var end = partialend ? parseInt(partialend, 10) : total-1;
    var chunksize = (end-start)+1;
    console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
 
    var file = fs.createReadStream(path, {start: start, end: end});
    res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
    file.pipe(res);
  } else {
    console.log('ALL: ' + total);
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
    fs.createReadStream(path).pipe(res);
  }
}


