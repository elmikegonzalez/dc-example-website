
const express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var winston = require('winston');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLess = require('express-less');
var markoExpress = require('marko/express');
var winston = require('./config/winston');
var contentPages = require('./routes/content-pages');
var visualization = require('./routes/visualization');
//var settings = require('./routes/settings');
var preview = require('./routes/preview');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(markoExpress());
// app.use(morgan('dev'));
//app.use(morgan('dev', { stream: winston.stream }));
app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode < 400
    }, stream: winston.stream
}));

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode >= 400
    }, stream: winston.stream
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public/css', expressLess(path.join(__dirname,'public','less')));
app.use(express.static(path.join(__dirname, 'public')));


//app.use('/settings', settings);
app.use('/preview', preview);
app.use('/preview/snapshot', visualization);

//app.use('/visualization', visualization);
app.use('/', contentPages);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
   winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);


  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

module.exports = app;
