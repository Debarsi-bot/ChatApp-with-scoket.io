const path = require('path')
const express = require('express');
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')


const app = express();
const server = http.createServer(app)
const io = socketio(server)

const PORT = 3000 || process.env.PORT
const serverName = "Server"
//set static folder
app.use(express.static(path.join(__dirname, 'public')))
app.use('./public', express.static('public'))

//client connects
io.on('connection', socket =>{
  console.log("new Client connected")

  //emits a message to client when user connects 
  socket.emit('message', formatMessage(serverName,'Welcome to chat'))

  //broadcasting an event to all connected clients except the user that connected or disconnected, whenever a user connects or disconnects
  //socket.broadcast.emit() instead of emitting to all connected sockets it will emit to all connected socket except the one it is being called on. So in this case the socket referenced by 
  //https://socket.io/docs/v3/broadcasting-events/
  socket.broadcast.emit('message', formatMessage(serverName,'A user has joined the chat'))

  //user disconnects
  socket.on('disconnect', ()=>{
    io.emit('message', formatMessage(serverName,'User has left the chat'))
  })

  //listen for chat messages from client
  socket.on('chatMessage', (message)=>{
    console.log(message)
    //we broadcast the message received to everybody including the sender
    io.emit('message', formatMessage('USER', message))
  })

})

server.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})