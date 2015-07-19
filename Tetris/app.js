var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var WebSocketServer = require("ws").Server;

var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.end('error: ' + err.message);
});

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function () {
  
});

var wss = new WebSocketServer({ server: server });
var rooms = [];
wss.on("connection", function (ws) {
    var no_rooms = true;
    var currentRoom;
    for (i = 0; i < rooms.length; i++) {
        if (rooms[i].length < 2) {
            rooms[i].push(ws);
            currentRoom = rooms[i];
            no_rooms = false;
            break;
        }
    }
    if (no_rooms) {
        rooms.push([ws]);
        currentRoom = rooms[rooms.length - 1];
    }
    ws.on("message", function (msg) {
        for (i = 0; i < currentRoom.length; i++) {
            if (currentRoom[i] != ws) {
                currentRoom[i].send(msg);
            }
        }
    });
});