#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var http = require('http');
var debug = require('debug')('chessAI:backend');
const { json } = require('express');
const { v4: uuidv4 } = require('uuid');
var express = require('express');

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

server.listen(port);
console.log('Listening on port ' + server.address().port);
server.on('error', onError);
server.on('listening', onListening);

var io = require('socket.io')(server);
app.set('io', io);

var roomsData = {};
app.set('roomsData', roomsData);

io.on('connection', socket => {
    console.log('new connection : ' + socket.id)
    socket.on('creatingRoom', (data, callback) => {
        try {
            let roomID = uuidv4()
            while (Object.keys(roomsData).includes(roomID)) {
                roomID = uuidv4()
            }
            roomsData[roomID] = data // data = { white:playerName, black:'' }
            socket.join(roomID);
            // socket.emit('roomCreated', { msg: 'La salle à été créée', roomID: roomID });
            callback({
                status: 200,
                roomID: roomID
            })
        } catch (err) {
            // socket.emit('customError', { msg: 'La salle n\a pas pu être créée Error => ' + err });
            callback({
                status: 500,
                err: err
            })
        }
    });

    socket.on('joiningRoom', (data, callback) => {
        var nbClient = numClientsInRoom(data.roomID);
        if (nbClient !== undefined && nbClient < 2) {
            let roomData = roomsData[data.roomID]
            let oponentName = ''
            let playerColor = true // true -> white, false -> black
            console.log(roomData)
            if (roomData.white === '') { 
                roomData.white = data.playerName
                oponentName = roomData.black
            }
            else { 
                roomData.black = data.playerName
                oponentName = roomData.white
                playerColor = !playerColor
            }
            roomsData[data.roomID] = roomData
            socket.join(data.roomID);
            console.log(io.sockets.adapter.rooms)
            socket.to(data.roomID).emit('roomJoined', { msg: 'Un joueur a rejoin la salle', oponentName: data.playerName });
            callback({
                status: 200,
                playerColor: playerColor,
                oponentName: oponentName
            })
        } else {
            callback({
                status: 500,
                err: 'La salle n\'existe pas ou est pleine (max 2 joueurs) !'
            })
            console.log('join error')
            // socket.emit('customError', { msg: 'La salle n\'existe pas ou est pleine (max 2 joueurs) !' });
        }
    });

    socket.on('validMove', (data, callback) => {
        try {
            socket.to(data.roomID).emit('oponentMove', {fen:data.fen})
            callback({
                status:200
            })
        } catch (err) {
            callback({
                status:500
            })
        }

    })

    socket.on('disconnecting', () => {
        const roomsID = socket.rooms;
        roomsID.forEach(roomID => {
            console.log(socket.id + ' is leaving ' + roomID )
            io.to(roomID).emit('userLeaved', { msg: 'Votre adversaire a quitté la salle' });
            socket.leave(roomID);
            delete roomsData[roomID];
        });
    });
})

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * 
 * @param namespace 
 * @param roomID 
 * @returns undefined if room doesn't exist | number of client in the room
 */
function numClientsInRoom(roomID) {
    console.log(io.sockets.adapter.rooms)
    var clients = io.sockets.adapter.rooms.get(roomID);
    return (clients)? clients.size : undefined
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}