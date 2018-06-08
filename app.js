var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var db = require('./utils/database');

var indexRouter = require('./routes/index');
var callbackRouter = require('./routes/callback');
var networkLogRouter = require('./routes/networklog');
var paymentRouter = require('./routes/payment');

var app = express();
// init scripts:
db.initProductsIfNotExist();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/network', networkLogRouter);
app.use('/callback', callbackRouter);
app.use('/payment', paymentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  
});

var server = app.listen(8091, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Plugin server listening at http://%s:%s", host, port)

})

module.exports = app;
