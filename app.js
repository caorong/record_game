"use strict";
// var fs = require('fs');

// fs.readFile("app.js", "utf8", function(error, data) {
//   console.log(data);
// });

var http = require('http');
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');

// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require(path.join(process.cwd(), 'routes', 'index.js'))

var app = express();

var options = {
  host: 'localhost',
  port: 9898
};


//check if server is already running
http.get(options, function(res) {
  console.log('server is running, redirecting to localhost');
  if (window.location.href.indexOf('localhost') < 0) { 
    window.location = 'http://localhost:' + app.get('port');
  }
}).on('error', function(e) {
  //server is not yet running
  // development error handler
  // will print stacktrace
  // if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
  // }

  // app.use(logger('dev'));
  // app.use(express.bodyParser()),

  // all environments
  app.set('port', process.env.PORT || 9898);
  app.set('views', process.cwd() + '/views');
  app.set('view engine', 'jade');
  // app.use(require('stylus').middleware(path.join(process.cwd(), 'public')));
  app.use(express.static(path.join(process.cwd(), 'public')));

  app.get('/', routes.index);
  app.get('/playvideo', routes.playvideo);
  app.get('/recordaudio', routes.recordaudio);

  app.get('/resource', routes.resource);

  app.get('/test', routes.test);

  http.createServer(app).listen(app.get('port'), function(err){
    console.log('server created');
    if (window.location.href.indexOf('localhost') < 0) { 
      window.location = 'http://localhost:' + app.get('port');
    }
  });
});







// view engine setup   
// __dirname 改成 process.cwd()
// app.set('views', path.join(process.cwd(), 'views'));
// app.set('view engine', 'jade');

// // uncomment after placing your favicon in /public
// //app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(process.cwd(), 'public')));

// app.use('/', routes);
// app.use('/users', users);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


// module.exports = app;


