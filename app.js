var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectRouter = require('./routes/projects');
const { error } = require('console');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret : process.env.SECRET_KEY,
  cookie : { maxAge : 3000000 }, //3000s
  resave : false,
  saveUninitialized : false,
  store : new session.MemoryStore({
    checkPeriod: 10000000 // 10000s
  })
}))



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectRouter);
app.use(express.json);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
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


