const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io')
const Filter = require('bad-words');
const { generateMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socket(server)

const publicDirPath = path.join(__dirname,'../public')
const port = process.env.PORT || 3000;

app.use(express.static(publicDirPath));

let count = 0;
/**
 * 
 * server (emit) --> client (receives)
 * client (emit) --> server (receives)
 * 
 * socket --> message only for the current user.
 * io --> message for all the users connected to the server.
 * broadcast --> message for all the users except the one currently joining.
 * 
 */

io.on('connection',(socket)=>{

    console.log('Socket is Connected')


    socket.on('chat', ({message, username}, callback)=>{
        
        const filter = new Filter();
        
        if(filter.isProfane(message)){
            return callback('Profane words are not allowed');
        }
        callback('Delivered!')

        io.emit('reply', generateMessage(message, username)); 
    })

    socket.on('mylocation', (lat, long, username, ack) => {
        
        ack('Location is shared')
        io.emit('location', generateMessage(`https://google.com/maps?q=${lat},${long}`, username))
    })

    socket.on('join', ({username, roomname}) => {
        socket.join(roomname)


        socket.emit('welcome', generateMessage(`Welcome ${username}. This is your Chat Screen`, username));
        socket.broadcast.to(roomname).emit('welcome', generateMessage(`${username} has joined here`, username)) 
    })

    socket.on('disconnect', ()=>{
        
        io.emit('welcome', generateMessage(`User has been disconnected`,username));
    })
})

server.listen(port, ()=>{

    console.log(`Server is on port ${port}`)
})