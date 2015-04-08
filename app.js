var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var miscrouter = express.Router();


var nano = require('nano')('http://localhost:5984');

var routes = require('./routes/index');
var listold = require('./routes/listsold');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', routes);
app.use('/old', listold);	//COMMENT OUT TO DISABLE OLD BROWSER VERSION

var server = app.listen(3000);
var db = require('./database');
db.activate(server);


app.use('/oldlistaction', miscrouter);	//COMMENT OUT TO DISABLE OLD BROWSER VERSION
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//more stuff for old browser implementation, comment out to disable
miscrouter.post('/raises', function(req, res)
{
	db.retroraise(req.body.meeting, req.body.name, req.body.ID, req.body.htype, function(){res.redirect(req.body.url);});
	
});
miscrouter.post('/lowers', function(req, res)
{
	db.retrolower(req.body.meeting, req.body.name, req.body.ID, function(){res.redirect(req.body.url);});
});

/// error handlers

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


//module.exports = app;
