var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials'); // incluir MW

var routes = require('./routes/index');
// var users = require('./routes/users'); Borrar ruta /users
// var creditos = require('./routes/author'); Crear creditos

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials()); // instalar MW
// Favicon in /public
// icono no animado, cuando navegador != firefox
app.use(favicon(__dirname + '/public/static/favicon.ico'));
// icono animado solo compatible con firefox
app.use(favicon(__dirname + '/public/animated/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());  // Eliminado { extended: false }
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// app.use('/users', users); Borrar ruta /users
// app.use('/author', creditos); Nueva ruta creditos

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
