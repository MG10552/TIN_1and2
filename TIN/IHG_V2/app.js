var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();
var server = require('http').Server(app);

// creating socket.io initial object
var io = require('socket.io')(server);
//var app = express();
//var httpServer = require('http').Server(app);
//var io = require('socket.io')(httpServer);
//io.on('connection', function(){ /* … */ });
//server.listen(80);
//var port = process.env.PORT || 3000;
// no musi

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function(req, res) {
    res.render('index');
});

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
// dealing with players within server frames
var players = [], playerNames = [];

var rooms = {};

io.on('connection', function(socket) {
    console.log('something has connected');

    //socket.emit('update rooms', rooms);

    socket.on('start game', function(puckId) {
        socket.puckId = puckId;
    });

    socket.on('refresh update', function(data) {
        if (socket.puckId === data.puckId) { // so this is his puck
            socket.broadcast.emit('refresh update', data);
        }
        //console.log(data.x, data.y); 
    });

    socket.on('disconnect', function() { // disconnect is a defult event
       /* if (rooms[socket.room].indexOf(socket) > -1 ) {
            rooms[socket.room].pop(socket);
        }*/

        if (players.indexOf(socket) > -1) {
            playerNames.pop(socket.username);
            players.pop(socket);
        }

        io.sockets.emit('show users', playerNames);


    });

    socket.on('add user', function(username) {
        // data.username
        // data.room
        if ( playerNames.indexOf(username) > -1) {
            socket.emit('validate user', false);
        } else {
            socket.username = username;
            players.push(socket);
            playerNames.push(username);

            socket.emit('validate user', true);
            io.sockets.emit('show users', playerNames);
            socket.emit('show rooms', rooms);
        }
    });

    socket.on('create room', function(roomName) {
        // data.username
        // data.room
        if ( rooms[roomName] ) {
            socket.emit('validate room', false);
        } else {
            rooms[roomName] = [{username: socket.username, playerSpot: null}];
            socket.playerRoom = roomName;
            socket.join(roomName);

            socket.emit('validate room', true);
            io.sockets.emit('show rooms', rooms);
        }
    });

    socket.on('take player spot', function(playerSpot) {
        var enter = true;
        if (socket.playerGotSpot) {
            enter = false;
        } else {
            rooms[socket.playerRoom].map(function(player) {
                if (player.playerSpot === playerSpot) {
                    enter = false;
                }
            });
        }


        if (!enter) {
            socket.emit('validate take player spot', {enter: enter});
        } else {
            socket.playerGotSpot = true;
            rooms[socket.playerRoom].map(function(player) {
                if (player.username === socket.username) {
                    player.playerSpot = playerSpot;
                }
            }); 
            
            io.sockets.to(socket.playerRoom).emit('validate take player spot', {enter: enter, playerSpot: playerSpot, username: socket.username});
        }
    });

    socket.on('join room', function(roomId) {
        if (socket.playerRoom) {
            socket.emit('validate join room', false);
        } else if (!rooms[roomId]) {
            socket.emit('validate join room', false);
        } else {
            socket.playerRoom = roomId;
            rooms[roomId].push({username: socket.username, playerSpot: null});
            socket.join(roomId);
            socket.emit('validate join room', true);
            socket.broadcast.to(roomId).emit('show lobby members', rooms[roomId]);
        }
    });

    socket.on('I moved', function(data) {
        socket.broadcast.to(socket.playerRoom).emit('player moved', data);
    });
    /*socket.on('Remaining pucks', function(data) {
        socket.broadcast.to(socket.playerRoom).emit('pucks left', data);
    });
    socket.on('Player1Score', function(data) {
        socket.broadcast.to(socket.playerRoom).emit('p1s', data);
    });
     socket.on('Player2Score', function(data) {
        socket.broadcast.to(socket.playerRoom).emit('p2s', data);
    });*/
});

    
server.listen(3000, '0.0.0.0');
//module.exports = app;