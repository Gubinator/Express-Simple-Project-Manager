var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { error } = require('console');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const projectRouter = require('./routes/projects');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectRouter);
app.use(express.json);

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

mongoose.set("strictQuery", false)
mongoose.connect('mongodb+srv://admin:root@projectmanager.tmkcbrx.mongodb.net/Node-API?retryWrites=true&w=majority')
.then(() => {
  console.log("Connected to MongoDB")
  app.listen(3000, () => {
    console.log("Node app is running on port 3000");
  })
}).catch((error) => {
  console.log(error)
})

module.exports = app;
